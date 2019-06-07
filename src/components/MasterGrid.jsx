import React, { Component } from 'react'
import './MasterGrid.css'

export class MasterGrid extends Component {
	state = {
		canvasHeight: '2048',
		canvasWidth: '2048'
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
		// console.log(window.devicePixelRatio)
		// console.log(ctx)
	}

	render() {
		return (
			<div className='grid'>
				<canvas ref='grid' height={this.state.canvasHeight} width={this.state.canvasWidth}/>
			</div>
		)
	}
	
	componentDidMount() {
		this.gridGen(7)
	}

	
}

export default MasterGrid
