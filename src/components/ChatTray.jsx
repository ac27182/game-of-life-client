import React, { Component } from 'react'
import './ChatTray.css'

export default class ChatTray extends Component {
	state = {
		chatTrayInput: '',
	}

	render() {
		return (
			<div ref='chatTray' className='chat-tray show'>
				<div
					className='chat-tray-toggle'
					onClick={() => this.toggleChatTray()}
				/>

				<div ref='chatTrayMessages' className='chat-tray-messages'>
					{this.props.chatMessages.map((chatMessage, i) => {
						const { message, hex } = chatMessage
						return (
							<div key={`chat-message${i}`} className='chat-tray-message'>
								{hex} {message}
							</div>
						)
					})}
				</div>
				<div className='chat-tray-input'>
					<input
						type='text'
						value={this.state.chatTrayInput}
						onChange={event => this.handleInput(event)}
						tabIndex='1'
					/>
					<div
						className='chat-tray-button'
						onClick={() => this.sendChatMessage()}
						tabIndex='2'
					/>
				</div>
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
	toggleChatTray = () => {
		const { chatTray } = this.refs
		if (chatTray.className.includes('show')) {
			chatTray.className = 'chat-tray hide'
		} else {
			chatTray.className = 'chat-tray show'
		}
	}
}
