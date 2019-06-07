import React, { Component } from 'react'
import './MasterGrid.css'

export class MasterGrid extends Component {
	state = {
		canvasHeight: '2048',
		canvasWidth: '2048',
		offset: [0,0],
		isDown: false
	}
	
	gridGen = (m) => {
		const ctx = this.refs.grid.getContext('2d')
		for (let x = 8; x < this.state.canvasHeight; x += 16) {
			for (let y = 8; y < this.state.canvasWidth; y += 16) {
				ctx.lineWidth = 0.25;
				ctx.beginPath();
				ctx.arc(x, y, 7, 0, 2*Math.PI)
				ctx.stroke()
			}				
		}
	}

	handleClick = (e) => {
		const grid = this.refs.grid
		const gridContainer = this.refs.gridContainer
		const ctx = this.refs.grid.getContext('2d')

		console.log('absolute click from left', e.clientX - (gridContainer.clientWidth - grid.clientWidth)/2)
		console.log('absolute click from top', e.clientY - (gridContainer.clientHeight - grid.clientHeight)/2)
		// absolute click from left and right
		const coordinates = [
			e.clientX - (gridContainer.clientWidth - grid.clientWidth)/2,
			e.clientY - (gridContainer.clientHeight - grid.clientHeight)/2
		]

		ctx.fillStyle = '#00FFFF'
		ctx.lineWidth = 0.25;
		ctx.beginPath();
		ctx.arc(coordinates[0], coordinates[1], 7, 0, 2*Math.PI)
		ctx.fill()
		ctx.stroke()

	}

	render() {
		return (
			<div className='grid-container' ref='gridContainer'>
				<canvas ref='grid' height={this.state.canvasHeight} width={this.state.canvasWidth} onClick={(e) => this.handleClick(e)}/>
			</div>
		)
	}
	
	componentDidMount() {
		const grid = this.refs.grid
		this.gridGen()
		// grid.addEventListener('mousedown', (e) => {
		// 	this.setState({
		// 		isDown: true,
		// 		offset: [
		// 			grid.offsetLeft - e.clientX,
		// 			grid.offsetTop - e.clientY
		// 		]
		// 	})
		// }, true)

		// grid.addEventListener('mouseup', (e) => {
		// 	// e.preventDefault();
		// 	this.setState({isDown: false})
		// }, true)

		// grid.addEventListener('mousemove', (event) => {
		// 	event.preventDefault()
		// 	if (this.state.isDown) {
		// 		// grid.style.x = `${event.clientX + this.state.offset[0]}px`
		// 		// grid.style.top = `${event.clientY + this.state.offset[1]}px`
		// 		grid.style.left = '-50px'
		// 	}
		// }, true)
	}

	
}

export default MasterGrid
