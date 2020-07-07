import React, { Component } from 'react'
import './App.css'

class App extends Component {
	state = {
		displayCamera: false,
	}

	openCamera = () => {
		if (!('mediaDevices' in navigator)) {
			navigator.mediaDevices = {}
		}

		if (!('getUserMedia' in navigator.mediaDevices)) {
			navigator.mediaDevices.getUserMedia = function (constraints) {
				var getUserMedia =
					navigator.webkitGetUserMedia || navigator.mozGetUserMedia

				if (!getUserMedia) {
					return Promise.reject(new Error('getUserMedia is not implemented!'))
				}

				return new Promise(function (resolve, reject) {
					getUserMedia.call(navigator, constraints, resolve, reject)
				})
			}
		}

		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then(function (stream) {
				const canvasElement = document.querySelector('canvas')
				canvasElement.style.display = 'none'

				const cameraScreen = document.querySelector('video')
				cameraScreen.style.display = 'block'
				cameraScreen.srcObject = stream
			})
			.catch(function (err) {
				return <div>{JSON.stringify(err)}</div>
			})
		this.setState({
			displayCamera: true,
		})
	}

	capture = () => {
		this.setState({
			displayCamera: false,
		})

		const cameraScreen = document.querySelector('video')
		cameraScreen.style.display = 'none'

		const canvasElement = document.querySelector('canvas')
		canvasElement.style.display = 'block'

		var context = canvasElement.getContext('2d')
		context.drawImage(
			cameraScreen,
			0,
			0,
			canvasElement.width,
			canvasElement.height
		)
		cameraScreen.srcObject.getVideoTracks().forEach(function (track) {
			track.stop()
		})
	}

	render() {
		const { displayCamera } = this.state
		return (
			<div className='App'>
				<canvas width={320} height={240} />
				<video autoPlay />

				{!displayCamera && (
					<button onClick={this.openCamera}>Open Camera</button>
				)}
				{displayCamera && <button onClick={this.capture}>Capture</button>}
			</div>
		)
	}
}

export default App
