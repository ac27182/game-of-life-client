import React, { Component } from 'react'
import './MasterGrid.css'
import ChatTray from './ChatTray'
import PatternTray from './PatternTray'
const sessionColour = Math.floor(Math.random() * 16777215)
	.toString(16)
	.padEnd(6, '0')

const lifePatterns = {
	singleNode: ['002002'],
	grid: [
		'000000',
		'000001',
		'000002',
		'000003',
		'000004',

		'001000',
		'001001',
		'001002',
		'001003',
		'001004',

		'002000',
		'002001',
		'002002',
		'002003',
		'002004',

		'003000',
		'003001',
		'003002',
		'003003',
		'003004',

		'004000',
		'004001',
		'004002',
		'004003',
		'004004',
	],
	spaceship: ['002001', '003002', '001003', '002003', '003003'],
	blinker: ['002001', '002002', '002003'],
}

export class MasterGrid extends Component {
	state = {
		canvasHeight: '2048',
		canvasWidth: '2048',
		isDown: false,
		currentCoordinates: '',
		connection: undefined,
		lifePattern: 'singleNode',
		chatMessages: [],
	}

	gridGen = () => {
		const { canvasLayer1 } = this.refs
		const ctx = canvasLayer1.getContext('2d')
		ctx.clearRect(0, 0, 2048, 2048)
		for (let x = 8; x < this.state.canvasHeight; x += 16) {
			for (let y = 8; y < this.state.canvasWidth; y += 16) {
				ctx.lineWidth = 0.25
				ctx.beginPath()
				ctx.arc(x, y, 7, 0, 2 * Math.PI)
				ctx.stroke()
			}
		}
	}

	socketTest = () => {
		const connection = new WebSocket(
			`wss://game-of-life-server.herokuapp.com/ws`,
		)
		connection.onopen = () => {
			console.log('websocket operational.')
		}
		connection.onerror = () => {
			console.log('websocket not operational.')
		}
		connection.onmessage = event => {
			const { code, payload } = JSON.parse(event.data)
			switch (code) {
				// sucessful single node update
				case 'r001':
					this.updateGrid(payload)
					break
				// unsucessful single node update
				case 'r002':
					this.updateGrid(payload)
					break
				// poll from the server
				case 'r003':
					this.updateGrid(payload)
					break
				// initial request from the server
				case 'r004':
					this.updateGrid(payload)
					break
				// array of messages initially from the server
				case 'r005':
					this.addMessages(payload)
					break
				// individual messages from the server
				case 'r006':
					this.addMessage(payload)
					break
				default:
					break
			}
		}
		this.setState({
			connection,
		})
	}

	addMessages = chatMessages => {
		this.setState({
			chatMessages,
		})
	}

	addMessage = chatMessage => {
		const { chatMessages } = this.state
		chatMessages.push(chatMessage)
		this.setState({
			chatMessages,
		})
	}

	/// updateGrid updates the life nodes on the grid
	updateGrid = nodes => {
		const { canvasLayer1 } = this.refs
		this.gridGen()
		for (let coordinates in nodes) {
			const hex = nodes[coordinates]
			this.drawNode(coordinates, hex, canvasLayer1)
		}
	}

	drawGrid = grid => {
		const t = c => {
			return (Number(c) + 0.5) * 16
		}
		const ctx = this.refs.canvasLayer1.getContext('2d')
		ctx.clearRect(0, 0, 2048, 2048)
		for (let k in grid) {
			let coordinates = k.split(':')
			ctx.fillStyle = `#${grid[k].V}`
			ctx.lineWidth = 0.25

			ctx.beginPath()
			ctx.arc(t(coordinates[0]), t(coordinates[1]), 7, 0, 2 * Math.PI)
			ctx.fill()
			ctx.stroke()
		}
	}

	sendLifeReqest = () => {
		const { connection, lifePattern } = this.state
		const request = this.lifeRequestGenerator(lifePatterns[lifePattern])
		connection.send(request)
	}

	drawNode = (coordinates, hex, ref) => {
		const ctx = ref.getContext('2d')
		ctx.fillStyle = `#${hex}`
		ctx.lineWidth = 0.25
		coordinates = this.gridCoordinateSplitter(coordinates)
		ctx.beginPath()
		ctx.arc(
			this.screenCoordinate(coordinates[0]),
			this.screenCoordinate(coordinates[1]),
			7,
			0,
			2 * Math.PI,
		)
		ctx.fill()
		ctx.stroke()
	}

	showTemporaryNodes = () => {
		const { canvasLayer2 } = this.refs
		const { lifePattern } = this.state
		const ctx = canvasLayer2.getContext('2d')
		ctx.clearRect(0, 0, 2048, 2048)

		lifePatterns[lifePattern].forEach(coordinates => {
			this.drawNode(this.transform(coordinates), sessionColour, canvasLayer2)
		})
	}

	// helper functions

	gridCoordinate = c => {
		return c - (c % 16) + 8
	}

	screenCoordinate = c => {
		return (Number(c) + 0.5) * 16
	}

	padAndReduce = c => {
		return String(c / 16 - 0.5).padStart(3, '0')
	}

	unpad = c => {
		return [Number(c.substring(0, 3)), Number(c.substring(3))]
	}

	transform = coordinates => {
		const { currentCoordinates } = this.state
		const [c1, c2] = this.unpad(currentCoordinates)
		const [a1, a2] = this.unpad(coordinates)
		const transformedCoordinates = `${String(a1 + c1 - 2).padStart(
			3,
			'0',
		)}${String(a2 + c2 - 2).padStart(3, '0')}`
		return transformedCoordinates
	}

	gridCoordinateSplitter = c => {
		return [c.substring(0, 3), c.substring(3)]
	}

	mouseEventWrapper = event => {
		const { canvasLayer1, gridContainer } = this.refs
		// const gridContainer = this.refs.gridContainer
		const absX = this.gridCoordinate(
			event.clientX -
				(gridContainer.clientWidth - canvasLayer1.clientWidth) / 2,
		)
		const absY = this.gridCoordinate(
			event.clientY -
				(gridContainer.clientHeight - canvasLayer1.clientHeight) / 2,
		)
		return {
			parsedCoordinates: `${this.padAndReduce(absX)}${this.padAndReduce(absY)}`,
			absX,
			absY,
		}
	}

	lifeRequestGenerator = lifePattern => {
		const request = {
			code: 'c001',
			payload: {},
		}
		lifePattern.forEach(coordinates => {
			coordinates = this.transform(coordinates)
			const { payload } = request
			payload[coordinates] = sessionColour
		})
		return JSON.stringify(request)
	}

	changeLifePattern = newLifePattern => {
		this.setState({
			lifePattern: newLifePattern,
		})
	}

	// react core functionality

	render() {
		return (
			<div className='grid-container' ref='gridContainer'>
				<canvas
					ref='canvasLayer1'
					className='canvas-layer-1'
					height={this.state.canvasHeight}
					width={this.state.canvasWidth}
				/>
				<canvas
					ref='canvasLayer2'
					className='canvas-layer-2'
					height={this.state.canvasHeight}
					width={this.state.canvasWidth}
					onClick={() => this.sendLifeReqest()}
				/>
				<ChatTray
					sessionColour={sessionColour}
					connection={this.state.connection}
					chatMessages={this.state.chatMessages}
				/>
				<PatternTray
					lifePatterns={lifePatterns}
					changeLifePattern={this.changeLifePattern}
					unpad={this.unpad}
					sessionColour={sessionColour}
				/>
			</div>
		)
	}

	componentDidMount() {
		this.gridGen()
		this.socketTest()
		this.refs.canvasLayer2.addEventListener('mousemove', event => {
			const { currentCoordinates } = this.state
			const { parsedCoordinates } = this.mouseEventWrapper(event)
			// const { canvasLayer2 } = this.refs
			if (currentCoordinates !== parsedCoordinates) {
				this.setState({
					currentCoordinates: parsedCoordinates,
				})
				this.showTemporaryNodes()
			}
		})
		this.refs.canvasLayer2.addEventListener('mouseleave', () => {
			const ctx = this.refs.canvasLayer2.getContext('2d')
			ctx.clearRect(0, 0, 2048, 2048)
		})
	}
}

export default MasterGrid
