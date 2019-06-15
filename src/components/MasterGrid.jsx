import React, { Component } from 'react'
import './MasterGrid.css'
let connection
const sessionColour = Math.floor(Math.random() * 16777215).toString(16)

export class MasterGrid extends Component {
	state = {
		canvasHeight: '2048',
		canvasWidth: '2048',
		offset: [0, 0],
		isDown: false,
		absX: 0,
		absY: 0,
	}

	gridGen = () => {
		const ctx = this.refs.grid.getContext('2d')
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
		connection = new WebSocket(`ws://localhost:3001/ws`)
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
				default:
					break
			}
		}
	}

	/// updateGrid updates the life nodes on the grid
	updateGrid = nodes => {
		const ctx = this.refs.grid.getContext('2d')
		const t = c => (Number(c) + 0.5) * 16
		ctx.clearRect(0, 0, 2048, 2048)
		this.gridGen()
		for (let coordinates in nodes) {
			const hex = nodes[coordinates]
			const x = t(Number(coordinates.substring(0, 3)))
			const y = t(Number(coordinates.substring(3, 6)))

			ctx.fillStyle = `#${hex}`
			ctx.lineWidth = 0.25

			ctx.beginPath()
			ctx.arc(x, y, 7, 0, 2 * Math.PI)
			ctx.fill()
			ctx.stroke()
		}
	}

	drawGrid = grid => {
		const t = c => {
			return (Number(c) + 0.5) * 16
		}
		const ctx = this.refs.grid.getContext('2d')
		ctx.clearRect(0, 0, 2048, 2048)
		for (let k in grid) {
			let coordinates = k.split(':')
			console.log(t(coordinates[0]), t(coordinates[1]))

			ctx.fillStyle = `#${grid[k].V}`
			ctx.lineWidth = 0.25

			ctx.beginPath()
			ctx.arc(t(coordinates[0]), t(coordinates[1]), 7, 0, 2 * Math.PI)
			ctx.fill()
			ctx.stroke()
		}
	}

	// handle click handles any click on the grid and sends a request to the server
	handleClick = e => {
		const grid = this.refs.grid
		const gridContainer = this.refs.gridContainer

		// we generate the aabsolute pixel number of the grid for drawing
		let absX = coordinateSetter(
			e.clientX - (gridContainer.clientWidth - grid.clientWidth) / 2,
		)
		let absY = coordinateSetter(
			e.clientY - (gridContainer.clientHeight - grid.clientHeight) / 2,
		)

		// we set the state so the absolute pixel number can be used in other functions
		this.setState({ absX, absY })

		// reduces absolute pixel number into circle number
		const request = JSON.stringify({
			code: 'c001',
			payload: {
				[`${padAndReduce(absX)}${padAndReduce(absY)}`]: sessionColour,
			},
		})
		console.log(padAndReduce(absX), padAndReduce(absY))
		connection.send(request)
	}

	hoverHandler = e => {
		// console.log(e)
	}

	render() {
		return (
			<div className='grid-container' ref='gridContainer'>
				<canvas
					ref='grid'
					height={this.state.canvasHeight}
					width={this.state.canvasWidth}
					onClick={e => this.handleClick(e)}
					onMouseOver={e => this.hoverHandler(e)}
				/>
			</div>
		)
	}

	componentDidMount() {
		this.gridGen()
		this.socketTest()
		this.refs.grid.addEventListener('mousemove', event => {
			console.log(mouseEventWrapper(event))
		})
	}
}

const coordinateSetter = c => c - (c % 16) + 8
const padAndReduce = c => String(c / 16 - 0.5).padStart(3, '0')
const mouseEventWrapper = event => {
	const grid = this.refs.grid
	const gridContainer = this.refs.gridContainer
	const absX = coordinateSetter(
		event.clientX - (gridContainer.clientWidth - grid.clientWidth) / 2,
	)
	const absY = coordinateSetter(
		event.clientY - (gridContainer.clientHeight - grid.clientHeight) / 2,
	)
	return {
		parsedCoordinates: `${padAndReduce(absX)}${padAndReduce(absY)}`,
		absX,
		absY,
	}
}

export default MasterGrid
