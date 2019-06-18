import React, { Component } from 'react'
import './PatternTray.css'
// import PatternTrayElement from './PatternTrayElement'

export default class PatternTray extends Component {
	render() {
		return (
			<div ref='patternTray' className='pattern-tray show'>
				<div
					ref='patternTrayToggle'
					className='pattern-tray-toggle'
					onClick={() => this.togglePatternTray()}
				/>
				{Object.keys(this.props.lifePatterns).map(lifePattern => {
					return (
						<canvas
							key={`canvas-${lifePattern}`}
							ref={`canvas-${lifePattern}`}
							className='pattern-tray-canvas'
							onClick={() => this.props.changeLifePattern(lifePattern)}
							width='80'
							height='80'
						/>
					)
				})}
			</div>
		)
	}
	componentDidMount() {
		Object.keys(this.props.lifePatterns).forEach(patternName => {
			const ctx = this.refs[`canvas-${patternName}`].getContext('2d')
			this.drawPatternCanvas(ctx, 5, 5)
			this.drawPattern(ctx, patternName)
		})
	}

	drawPattern = (ctx, patternName) => {
		const { lifePatterns, unpad, sessionColour } = this.props
		lifePatterns[patternName].forEach(c => {
			const [x, y] = unpad(c)
			this.drawCanvasNode(ctx, x, y, sessionColour)
		})
	}

	drawPatternCanvas = (ctx, width, height) => {
		for (let x = 0; x < width + 1; x++) {
			for (let y = 0; y < height + 1; y++) {
				this.drawCanvasNode(ctx, x, y)
			}
		}
	}

	drawCanvasNode = (ctx, x, y, hex) => {
		ctx.lineWidth = 0.25
		if (hex) ctx.fillStyle = `#${hex}`

		ctx.beginPath()
		ctx.arc(x * 16 + 8, y * 16 + 8, 7, 0, 2 * Math.PI)
		if (hex) ctx.fill()
		ctx.stroke()
	}

	togglePatternTray = () => {
		const { patternTray } = this.refs
		if (patternTray.className.includes('show')) {
			patternTray.className = 'pattern-tray hide'
		} else {
			patternTray.className = 'pattern-tray show'
		}
	}
}
