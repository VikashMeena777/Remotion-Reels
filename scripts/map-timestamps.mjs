#!/usr/bin/env node
/**
 * map-timestamps.mjs
 * 
 * Takes Whisper word-level timestamps JSON + original Remotion props JSON,
 * maps words to phrases to compute exact startFrame/durationInFrames per phrase,
 * and writes updated props to output file.
 * 
 * KEY DESIGN: Each phrase EXTENDS until the next phrase starts + overlap,
 * so there are NEVER gaps between phrases. The crossfade in PhraseScene
 * handles smooth transitions.
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

// Overlap frames for crossfade (matches PhraseScene crossfade timing)
const OVERLAP_FRAMES = 10;

// Load files
const whisperData = JSON.parse(readFileSync(whisperPath, 'utf8'));
const props = JSON.parse(readFileSync(propsPath, 'utf8'));

// Extract word timestamps from Whisper output
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
 * Normalize text for comparison
 */
function normalize(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Step 1: Find the Whisper start/end time for each phrase
 */
const phrases = props.phrases;
let wordIdx = 0;
const phraseTimings = [];

for (let i = 0; i < phrases.length; i++) {
    const phrase = phrases[i];
    const phraseWords = normalize(phrase.text).split(' ');

    // Find the starting word index for this phrase
    let bestStart = wordIdx;
    let bestScore = 0;

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

    const phraseStartWord = Math.min(bestStart, words.length - 1);
    const phraseEndWord = Math.min(bestStart + phraseWords.length - 1, words.length - 1);

    const startTime = words[phraseStartWord].start;
    const endTime = words[phraseEndWord].end;

    phraseTimings.push({ startTime, endTime });

    console.log(`  📍 Phrase ${i + 1}: "${phrase.text}" → ${startTime.toFixed(2)}s-${endTime.toFixed(2)}s`);

    wordIdx = phraseEndWord + 1;
}

/**
 * Step 2: Set startFrame and durationInFrames with OVERLAP
 * Each phrase extends until the next phrase starts + overlap frames,
 * so crossfades are seamless (no black gaps).
 */
for (let i = 0; i < phrases.length; i++) {
    const timing = phraseTimings[i];
    const startFrame = Math.round(timing.startTime * fps);

    let endFrame;
    if (i < phrases.length - 1) {
        // Extend to where the NEXT phrase starts + overlap for smooth crossfade
        const nextStartFrame = Math.round(phraseTimings[i + 1].startTime * fps);
        endFrame = nextStartFrame + OVERLAP_FRAMES;
    } else {
        // Last phrase: use its natural end + a small buffer
        endFrame = Math.round(timing.endTime * fps) + Math.round(fps * 0.5);
    }

    phrases[i].startFrame = startFrame;
    phrases[i].durationInFrames = Math.max(20, endFrame - startFrame);

    console.log(`  ✅ Phrase ${i + 1}: frame ${startFrame}–${endFrame} (${phrases[i].durationInFrames} frames, ${(phrases[i].durationInFrames / fps).toFixed(1)}s)`);
}

// Get actual audio duration from Whisper
const audioDuration = whisperData.duration || words[words.length - 1].end || 20;
const audioEndFrame = Math.round(audioDuration * fps);

// The last phrase visual ends here
const lastPhrase = phrases[phrases.length - 1];
const lastPhraseEnd = lastPhrase.startFrame + lastPhrase.durationInFrames;

// Author + CTA come after audio ends (4 seconds total)
const outroDuration = Math.round(fps * 4);
const totalFrames = Math.max(lastPhraseEnd, audioEndFrame) + outroDuration;

// Update props
props.phrases = phrases;
props.totalFrames = totalFrames;
props.durationInSeconds = Math.ceil(totalFrames / fps);
props.audioDuration = audioDuration;
delete props.phraseDuration;

// Write output
writeFileSync(outputPath, JSON.stringify(props, null, 2));

console.log(`\n🎬 Timing Summary:`);
console.log(`  Audio duration: ${audioDuration.toFixed(1)}s`);
console.log(`  Last phrase visual ends: frame ${lastPhraseEnd} (${(lastPhraseEnd / fps).toFixed(1)}s)`);
console.log(`  Audio ends: frame ${audioEndFrame} (${(audioEndFrame / fps).toFixed(1)}s)`);
console.log(`  Outro starts: frame ${Math.max(lastPhraseEnd, audioEndFrame)}`);
console.log(`  Total frames: ${totalFrames} (${(totalFrames / fps).toFixed(1)}s)`);
console.log(`\n✅ Synced props written to ${outputPath}`);
