#!/usr/bin/env node
/**
 * map-timestamps.mjs
 * 
 * Takes Whisper word-level timestamps JSON + original Remotion props JSON,
 * maps words to phrases to compute exact startFrame/durationInFrames per phrase,
 * and writes updated props to output file.
 * 
 * Usage:
 *   node scripts/map-timestamps.mjs \
 *     --whisper /tmp/whisper-output.json \
 *     --props /tmp/props.json \
 *     --output /tmp/props-synced.json \
 *     --fps 30
 */

import { readFileSync, writeFileSync } from 'fs';

// Parse CLI args
const args = process.argv.slice(2);
function getArg(name, fallback) {
    const idx = args.indexOf(`--${name}`);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
}

const whisperPath = getArg('whisper', '/tmp/whisper-output.json');
const propsPath = getArg('props', '/tmp/props.json');
const outputPath = getArg('output', '/tmp/props-synced.json');
const fps = parseInt(getArg('fps', '30'), 10);

// Load files
const whisperData = JSON.parse(readFileSync(whisperPath, 'utf8'));
const props = JSON.parse(readFileSync(propsPath, 'utf8'));

// Extract word timestamps from Whisper output
// Whisper outputs: { segments: [{ words: [{word, start, end}, ...] }] }
// or for some versions: { words: [{word, start, end}, ...] }
let words = [];
if (whisperData.words && Array.isArray(whisperData.words)) {
    words = whisperData.words;
} else if (whisperData.segments) {
    for (const seg of whisperData.segments) {
        if (seg.words) {
            words.push(...seg.words);
        }
    }
}

if (words.length === 0) {
    console.error('❌ No word timestamps found in Whisper output!');
    console.error('Whisper data keys:', Object.keys(whisperData));
    process.exit(1);
}

console.log(`📝 Found ${words.length} words with timestamps`);
console.log(`📄 Found ${props.phrases.length} phrases to map`);

/**
 * Normalize text for comparison:
 * - lowercase, remove punctuation, collapse whitespace
 */
function normalize(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Map words to phrases using sequential matching.
 * For each phrase, find the span of words that matches its text.
 */
const phrases = props.phrases;
let wordIdx = 0;

for (let i = 0; i < phrases.length; i++) {
    const phrase = phrases[i];
    const phraseWords = normalize(phrase.text).split(' ');

    // Find the starting word index for this phrase
    let bestStart = wordIdx;
    let bestScore = 0;

    // Search window: from current position to a reasonable range ahead
    const searchEnd = Math.min(wordIdx + phraseWords.length + 5, words.length);

    for (let tryStart = wordIdx; tryStart < searchEnd; tryStart++) {
        let matchCount = 0;
        for (let pw = 0; pw < phraseWords.length && tryStart + pw < words.length; pw++) {
            const whisperWord = normalize(words[tryStart + pw].word);
            if (whisperWord === phraseWords[pw] ||
                whisperWord.includes(phraseWords[pw]) ||
                phraseWords[pw].includes(whisperWord)) {
                matchCount++;
            }
        }
        if (matchCount > bestScore) {
            bestScore = matchCount;
            bestStart = tryStart;
        }
    }

    // Calculate start and end times
    const phraseStartWord = Math.min(bestStart, words.length - 1);
    const phraseEndWord = Math.min(bestStart + phraseWords.length - 1, words.length - 1);

    const startTime = words[phraseStartWord].start;
    const endTime = words[phraseEndWord].end;

    // Convert to frames
    phrase.startFrame = Math.round(startTime * fps);
    phrase.durationInFrames = Math.max(15, Math.round((endTime - startTime) * fps));

    console.log(`  ✅ Phrase ${i + 1}: "${phrase.text}" → ${startTime.toFixed(2)}s-${endTime.toFixed(2)}s (frame ${phrase.startFrame}-${phrase.startFrame + phrase.durationInFrames})`);

    // Advance word pointer past this phrase
    wordIdx = phraseEndWord + 1;
}

// Calculate total duration
const lastPhrase = phrases[phrases.length - 1];
const lastPhraseEnd = lastPhrase.startFrame + lastPhrase.durationInFrames;

// Add some padding for author + CTA scenes after the audio
const outroDuration = Math.round(fps * 4); // 4 seconds for author + CTA
const totalFrames = lastPhraseEnd + outroDuration;

// Get actual audio duration from Whisper
const audioDuration = whisperData.duration || words[words.length - 1].end || (totalFrames / fps);

// Update props
props.phrases = phrases;
props.totalFrames = totalFrames;
props.durationInSeconds = Math.ceil(totalFrames / fps);
props.audioDuration = audioDuration;

// Remove old phraseDuration if present (no longer needed)
delete props.phraseDuration;

// Write output
writeFileSync(outputPath, JSON.stringify(props, null, 2));

console.log(`\n🎬 Timing Summary:`);
console.log(`  Audio duration: ${audioDuration.toFixed(1)}s`);
console.log(`  Last phrase ends at: ${(lastPhraseEnd / fps).toFixed(1)}s (frame ${lastPhraseEnd})`);
console.log(`  Outro: ${(outroDuration / fps).toFixed(1)}s`);
console.log(`  Total frames: ${totalFrames} (${(totalFrames / fps).toFixed(1)}s)`);
console.log(`\n✅ Synced props written to ${outputPath}`);
