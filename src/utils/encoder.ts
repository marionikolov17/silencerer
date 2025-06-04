class Encoder {
  public static async encodeWAV(inputBuffer: ArrayBuffer | AudioBuffer) {
    let audioBuffer = inputBuffer;

    if (audioBuffer instanceof ArrayBuffer) {
      audioBuffer = await this.decodeAudioBuffer(audioBuffer);
    }

    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const bytesPerSample = 2;
    const numSamples = audioBuffer.length;
    const wavSize = 44 + numSamples * bytesPerSample;

    const buffer = new ArrayBuffer(wavSize);
    const view = new DataView(buffer);

    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, wavSize - 8, true);
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * bytesPerSample, true);
    view.setUint16(32, numChannels * bytesPerSample, true);
    view.setUint16(34, 16, true);
    this.writeString(view, 36, 'data');
    view.setUint32(40, numSamples * bytesPerSample, true);

    const audioData = audioBuffer.getChannelData(0);
    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
      const sample = Math.max(-1, Math.min(1, audioData[i]));
      view.setInt16(offset, sample * 0x7fff, true);
      offset += 2;
    }

    return buffer;
  }

  private static async decodeAudioBuffer(buffer: ArrayBuffer) {
    const audioContext = new AudioContext();
    return audioContext.decodeAudioData(buffer);
  }

  private static writeString = (
    view: DataView,
    offset: number,
    str: string,
  ): void => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };
}

export default Encoder;
