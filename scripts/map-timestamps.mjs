#!/usr/bin/env node
/**
 * map-timestamps.mjs
 * 
 * Takes Whisper word-level timestamps + Remotion props,
 * uses each phrase's `speechSegment` (the exact spoken words) to find
 * when that segment starts/ends in the audio, then sets startFrame/durationInFrames.
 * 
 * Each phrase extends until the next phrase starts + overlap for smooth crossfade.
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

const OVERLAP_FRAMES = 10;

// Load files
const whisperData = JSON.parse(readFileSync(whisperPath, 'utf8'));
const props = JSON.parse(readFileSync(propsPath, 'utf8'));

// Extract word timestamps
let words = [];
if (whisperData.words && Array.isArray(whisperData.words)) {
    words = whisperData.words;
} else if (whisperData.segments) {
    for (const seg of whisperData.segments) {
        if (seg.words) words.push(...seg.words);
    }
}

if (words.length === 0) {
    console.error('❌ No word timestamps found in Whisper output!');
    process.exit(1);
}

console.log(`📝 Found ${words.length} words with timestamps`);
console.log(`📄 Found ${props.phrases.length} phrases to map`);

/** Normalize text for comparison */
function normalize(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Match using speechSegment (the exact spoken words for each phrase).
 * Sequential matching — each phrase picks up where the last left off.
 */
const phrases = props.phrases;
let wordIdx = 0;
const phraseTimings = [];

for (let i = 0; i < phrases.length; i++) {
    const phrase = phrases[i];
    // Use speechSegment for matching (it's the actual spoken words)
    const matchText = phrase.speechSegment || phrase.text;
    const segmentWords = normalize(matchText).split(' ').filter(w => w.length > 0);

    if (segmentWords.length === 0) {
        // Fallback: just take the next few words
        const startWord = Math.min(wordIdx, words.length - 1);
        const endWord = Math.min(wordIdx + 3, words.length - 1);
        phraseTimings.push({ startTime: words[startWord].start, endTime: words[endWord].end });
        wordIdx = endWord + 1;
        continue;
    }

    // Find best starting position for this segment's words
    let bestStart = wordIdx;
    let bestScore = -1;

    // Search from current position (allow small look-ahead for alignment)
    const searchEnd = Math.min(wordIdx + segmentWords.length + 8, words.length);

    for (let tryStart = Math.max(0, wordIdx - 2); tryStart < searchEnd; tryStart++) {
        let score = 0;
        for (let sw = 0; sw < segmentWords.length && tryStart + sw < words.length; sw++) {
            const whisperWord = normalize(words[tryStart + sw].word);
            const segWord = segmentWords[sw];
            if (whisperWord === segWord) {
                score += 2; // Exact match
            } else if (whisperWord.includes(segWord) || segWord.includes(whisperWord)) {
                score += 1; // Partial match
            }
        }
        if (score > bestScore) {
            bestScore = score;
            bestStart = tryStart;
        }
    }

    // Calculate timing from the matched word span
    const startWordIdx = Math.min(bestStart, words.length - 1);
    const endWordIdx = Math.min(bestStart + segmentWords.length - 1, words.length - 1);

    const startTime = words[startWordIdx].start;
    const endTime = words[endWordIdx].end;

    phraseTimings.push({ startTime, endTime });

    console.log(`  📍 Phrase ${i + 1}: "${phrase.text}"`);
    console.log(`     Speech: "${matchText.substring(0, 50)}..."`);
    console.log(`     → ${startTime.toFixed(2)}s-${endTime.toFixed(2)}s (words ${startWordIdx}-${endWordIdx})`);

    // Advance past this segment
    wordIdx = endWordIdx + 1;
}

/**
 * Set startFrame and durationInFrames with overlap.
 * Each phrase extends until the next starts + overlap.
 */
for (let i = 0; i < phrases.length; i++) {
    const timing = phraseTimings[i];
    const startFrame = Math.round(timing.startTime * fps);

    let endFrame;
    if (i < phrases.length - 1) {
        const nextStartFrame = Math.round(phraseTimings[i + 1].startTime * fps);
        endFrame = nextStartFrame + OVERLAP_FRAMES;
    } else {
        endFrame = Math.round(timing.endTime * fps) + Math.round(fps * 0.5);
    }

    phrases[i].startFrame = startFrame;
    phrases[i].durationInFrames = Math.max(20, endFrame - startFrame);

    // Remove speechSegment from final props (not needed by Remotion)
    delete phrases[i].speechSegment;

    console.log(`  ✅ Phrase ${i + 1}: "${phrases[i].text}" [${phrases[i].visual}] → frame ${startFrame}–${endFrame} (${phrases[i].durationInFrames}f)`);
}

// Audio duration
const audioDuration = whisperData.duration || words[words.length - 1].end || 20;
const audioEndFrame = Math.round(audioDuration * fps);
const lastPhrase = phrases[phrases.length - 1];
const lastPhraseEnd = lastPhrase.startFrame + lastPhrase.durationInFrames;

// Outro for Author/CTA
const outroDuration = Math.round(fps * 4);
const totalFrames = Math.max(lastPhraseEnd, audioEndFrame) + outroDuration;

// Update props
props.phrases = phrases;
props.totalFrames = totalFrames;
props.durationInSeconds = Math.ceil(totalFrames / fps);
props.audioDuration = audioDuration;
delete props.phraseDuration;

writeFileSync(outputPath, JSON.stringify(props, null, 2));

console.log(`\n🎬 Timing Summary:`);
console.log(`  Audio: ${audioDuration.toFixed(1)}s`);
console.log(`  Last phrase ends: frame ${lastPhraseEnd} (${(lastPhraseEnd / fps).toFixed(1)}s)`);
console.log(`  Total frames: ${totalFrames} (${(totalFrames / fps).toFixed(1)}s)`);
console.log(`\n✅ Synced props written to ${outputPath}`);
