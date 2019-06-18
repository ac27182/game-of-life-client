import React, { Component } from 'react'
import './ChatTray.css'

export default class ChatTray extends Component {
	state = {
		chatTrayInput: '',
	}

	render() {
		return (
			<div className='chat-tray'>
				<input
					value={this.state.chatTrayInput}
					onChange={event => this.handleInput(event)}
				/>
				<div
					className='chat-tray-button'
					onClick={() => this.sendChatMessage()}
				/>
			</div>
		)
	}
	handleInput = event => {
		const { value } = event.target
		this.setState({
			chatTrayInput: value,
		})
	}
	sendChatMessage = () => {
		const { chatTrayInput } = this.state
		const { connection, sessionColour } = this.props
		if (!chatTrayInput) return

		const chatMessage = {
			code: 'c002',
			payload: {
				timestamp: String(Date.now()),
				message: chatTrayInput,
				hex: sessionColour,
			},
		}

		connection.send(JSON.stringify(chatMessage))

		this.setState({
			chatTrayInput: '',
		})
	}
}
