var practiceVm = new Vue({
	el: "#practice",
	data: {
		suggestedPitch: '',
		suggestedFrequency: 0,
		incomingPitchNormalized: 0,
		pitch: '',
		voice: null,
		tuner: null,
		piano: new Wad(Wad.presets.piano),
		hat:new Wad(Wad.presets.hiHatClosed),
		rafId:0,
		intervalId:0,
		encouragers: ['way to go!','you CAN sing a note!','you did it!', 'sounding good!', "pitchin'!", 'right on!', 'you CAN sing a note!','keep it up!', 'you rock!'],
		encourager: 'way to go!',
		text: '',
		practicing: false,
		high_low: '',
		isDetecting: false,
	},
	methods: {

		logPitch: function(){
		    // console.log(this)

		    // console.log(this.tuner.pitch, this.tuner.noteName)
		    if ( this.tuner.noteName !== undefined ){
		    	this.pitch = this.tuner.noteName
		    }
		    this.rafId = requestAnimationFrame(this.logPitch)
		},
		startDetection: function() {
			this.isDetecting = true
			this.suggestedPitch = Wad.pitchesArray.slice(36,60)[Math.floor(Math.random() * 25)]
			this.playSuggestedPitch()
			this.suggestedFrequency = Wad.pitches[this.suggestedPitch]
			this.voice.play() // You must give your browser permission to access your microphone before calling play().
			this.tuner.updatePitch() // The tuner is now calculating the pitch and note name of its input 60 times per second. These values are stored in tuner.pitch and tuner.noteName.
			this.logPitch()
			if (this.intervalId) {
				clearInterval(this.intervalId)
			}
			this.practicing = true
			this.intervalId = setInterval(()=>{
				this.isPitchMatched()
			},500)

			// this.suggestedFrequency = this.calculateNormalizedPitch(this.tuner.pitch)
			// const percentage = (this.incomingPitchNormalized * 100).toFixed(0)
			// $('#indicator').width(`${percentage}%`)

		},
		stopFeedback: function() {
			this.voice.stop() // 
			cancelAnimationFrame(this.rafId)
			clearInterval(this.intervalId)
			this.tuner.stopUpdatingPitch(); // Stop calculating the pitch if you don't need to know it anymore.
			this.practicing = false

		},

		playSuggestedPitch: function() {
			this.piano.play({pitch: this.suggestedPitch, env:{hold: .6}})
		},
		isPitchMatched: function() {
			// console.log(this.suggestedPitch, this.tuner.noteName)
			if (this.suggestedPitch === this.tuner.noteName) {
				this.switchEncouragers()
				$('#exampleModal').modal('show')
				this.stopFeedback()
				this.hat.play()
				this.hat.play({wait: .3})
			}
			const diff = this.tuner.pitch - this.suggestedFrequency

			this.incomingPitchNormalized = this.calculateNormalizedPitch(this.tuner.pitch)
			const percentage = (this.incomingPitchNormalized * 100).toFixed(0)
			$('#pitchBar').height(`${percentage}%`)
			this.high_low = diff < 0 ? 'A bit too flat - sing higher!' : 'A bit too sharp - sing lower!'
			console.log(
				'diff', diff,
				'suggested', this.suggestedFrequency, 
				'incoming', this.tuner.pitch, 
				'normalized', this.incomingPitchNormalized,
				diff < 0 ? 'go higher' : 'go lower'
			)
		},
		// savePitch: function() {

		// 	$.post
		// }

		switchEncouragers: function() {
			this.encourager = this.encouragers[Math.floor(Math.random() * this.encouragers.length)]
		},
		calculateNormalizedPitch: function(incoming) {
			const lowestPitch = Wad.pitches[Wad.pitchesArray[36]]
			const highestPitch = Wad.pitches[Wad.pitchesArray[60]]
			return Math.min(1, (incoming - lowestPitch) / (highestPitch - lowestPitch))
		},
	},
	created: function() {
		this.voice = new Wad({source : 'mic' }); // At this point, user's browser will ask for permission to access user's microphone.
		this.tuner = new Wad.Poly();
		this.tuner.add(this.voice);

	},

})

