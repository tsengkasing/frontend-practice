/**
 * Created by Think on 2017/7/3.
 */
import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

const styles = {
    subtitle: {
        color: 'black',
        margin: '0 8px'
    },
    block_time: {
        margin: '24px 0 0 8px',
        fontSize: 14
    }
};

export default class TaskEditDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            content: '第一个',
            tag: '这是一个标签',
            done: false,
            detail: '',
            time: new Date(),

            open: false,
            index: -1
        }
    }

    handleOpen = (task, index) => {
        this.setState(Object.assign({open: true, index: index}, task));
    };

    handleSubmit = () => {
        this.props.modify({
            content: this.state.content,
            tag: this.state.tag,
            done: this.state.done,
            detail: '',
            time: new Date(),
        }, this.state.index);
        this.handleClose();
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleInputContent = (event) => { this.setState({content: event.target.value}); };

    handleInputTag = (event) => { this.setState({tag:  event.target.value}) };

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                onTouchTap={this.handleSubmit}
            />,
        ];

        return (
            <div>
                <Dialog
                    title="Edit A Task"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    <span style={styles.subtitle}>Title:</span>
                    <TextField
                        hintText="This task called ?"
                        value={this.state.content}
                        onChange={this.handleInputContent}
                    /><br/>

                    <span style={styles.subtitle}>Tag:</span>
                    <TextField
                        hintText="what's the tag of this task ?"
                        value={this.state.tag}
                        onChange={this.handleInputTag}
                    />

                    <br/>
                    <div style={styles.block_time}>Last Updated Time: {this.state.time.toLocaleString()}</div>
                </Dialog>
            </div>
        );
    }
}