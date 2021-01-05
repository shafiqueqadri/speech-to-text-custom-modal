export const downsampleBuffer = (
	buffer: any,
	sampleRate: any,
	outSampleRate: any
) => {
	if (outSampleRate == sampleRate) {
		return buffer
	}
	if (outSampleRate > sampleRate) {
		throw 'downsampling rate show be smaller than original sample rate'
	}
	let sampleRateRatio = sampleRate / outSampleRate
	let newLength = Math.round(buffer.length / sampleRateRatio)
	let result = new Int16Array(newLength)
	let offsetResult = 0
	let offsetBuffer = 0
	while (offsetResult < result.length) {
		let nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio)
		let accum = 0,
			count = 0
		for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
			accum += buffer[i]
			count++
		}

		result[offsetResult] = Math.min(1, accum / count) * 0x7fff
		offsetResult++
		offsetBuffer = nextOffsetBuffer
	}
	
	return result
}


export const isEmptyBuffer = (nsgArrayBuffer: any) => {
	let nsgArray = new Uint8Array(nsgArrayBuffer)
	return nsgArray.every((element) => {
		return element === 0
	})
}