import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import Chip from 'material-ui/Chip';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ActionDeleteForever from 'material-ui/svg-icons/action/delete-forever';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';

import TaskEditDialog from './TaskEditDialog/TaskEditDialog';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search_mode: false,

            filter_menu_open: false,
            filter: 'All',

            search_menu_open: false,
            input_type: 'Add',

            todo_list: [],
            display_list: [],
            task_input: ''
        };
    }


    //主要功能部分========================================================
    handleInputText = (event) => {
        const input = event.target.value;
        this.setState({task_input: input});
        if(this.state.input_type !== 'Add') {
            const { todo_list } = this.state;
            let display_list = [];
            switch (this.state.input_type) {
                case 'Tag':
                    display_list = todo_list.filter((item) => item.tag.search(input) !== -1);
                    break;
                case 'Content':
                    display_list = todo_list.filter((item) => item.content.search(input) !== -1);
                    break;
                default: break;
            }
            this.setState({display_list});
        }
    };

    handleAddTask = (content) => {
        let { todo_list } = this.state;
        todo_list.unshift({
            content: content,
            done: false,
            tag: 'default',
            time: new Date(),
        });
        this.setState({
            todo_list,
            task_input: ''
        }, () => {
            this.handleSelectFilter(this.state.filter);
            this.handleStore();
        });
    };

    handleRemoveTask = (index) => {
        let { todo_list, display_list } = this.state;
        let index_all = todo_list.indexOf(display_list[index]);
        todo_list = todo_list.slice(0, index_all).concat(todo_list.slice(index_all + 1));
        this.setState({todo_list}, () => {
            this.handleSelectFilter(this.state.filter);
            this.handleStore();
        });
    };

    handleCheckTask = (index, isInputChecked) => {
        let { todo_list, display_list } = this.state;
        let index_all = todo_list.indexOf(display_list[index]);
        todo_list[index_all].done = isInputChecked;
        this.setState({todo_list}, () => {
            this.handleSelectFilter(this.state.filter);
            this.handleStore();
        });
    };

    handleUpdateTask = (task, index) => {
        let { todo_list } = this.state;
        todo_list[index] = task;
        this.setState({todo_list}, () => {
            this.handleSelectFilter(this.state.filter);
            this.handleStore();
        });
    };


    handleClearCompleted = () => {
        let { todo_list } = this.state;
        todo_list = todo_list.filter((item) => !item.done);
        //因为setState是异步的,故在todo_list更新结束后，才调用过滤器重新过滤
        this.setState({todo_list, display_list: todo_list}, () => {
            if(!this.state.search_mode) {
                this.handleSelectFilter(this.state.filter);
            }
            this.handleStore();
        });
    };

    handleCountUnCompletedTask = () => {
        let count = 0;
        for(let task of this.state.todo_list) {
            if(!task.done) count++;
        }
        return count;
    };

    //主要功能部分结束========================================================


    //查找功能部分========================================================
    handleOpenSearchMenu = (event) => {
        event.preventDefault();
        this.setState({
            search_menu_open: true,
            search_anchorEl: event.currentTarget
        });
    };

    //切换查找器
    handleSelectSearch = (type) => {
        this.setState({
            search_menu_open: false,
            input_type: type,
            filter: 'All',
            search_mode: type !== 'Add'
        });
        this.handleSelectFilter('All')
    };

    handleRequestCloseSearchMenu = () => { this.setState({search_menu_open: false}) };

    //查找功能部分结束========================================================


    //filter部分========================================================
    handleOpenFilterMenu = (event) => {
        event.preventDefault();
        this.setState({
            filter_menu_open: true,
            anchorEl: event.currentTarget
        });
    };

    //切换过滤器
    handleSelectFilter = (filter) => {
        const { todo_list } = this.state;
        let display_list = [];
        switch (filter) {
            case 'All':
                display_list = todo_list;
                break;
            case 'Active':
                display_list = todo_list.filter((item) => !item.done);
                break;
            case 'Completed':
                display_list = todo_list.filter((item) => item.done);
                break;
            default: break;
        }
        this.setState({
            display_list: display_list,
            filter_menu_open: false,
            filter: filter
        });
    };

    handleRequestCloseFilterMenu = () => { this.setState({filter_menu_open: false}) };

    //filter部分结束========================================================


    //持久化部分========================================================
    handleRestore = () => {
        let storage = window.localStorage.getItem('TINYTODOLIST');
        try {
            if(storage && typeof storage === 'string') {
                storage = JSON.parse(storage);
                this.setState(Object.assign({
                    filter_menu_open: false,

                    filter: 'All',

                    input_type: 'Add',

                    todo_list: [],
                    display_list: [],
                    task_input: ''
                }, storage), () => this.handleSelectFilter(this.state.filter));
            }
        }catch(e) {
            console.error(e);
        }
    };

    handleStore = () => {
        const { todo_list } = this.state;
        window.localStorage.setItem('TINYTODOLIST', JSON.stringify({todo_list}));
    };

    //持久化部分结束========================================================



    componentDidMount() {
        // this.setState({todo_list: mock, display_list: mock});
        this.handleRestore();
    }

    render() {
        return (
            <MuiThemeProvider>
                <div className="App">
                    <div id="title_svg">
                        <svg width="1024" height="140" viewBox="0 0 600 160" preserveAspectRatio="xMidYMid meet">
                            <symbol id="title">
                                <text x="0" y="100" fillOpacity="0" style={{fontSize: 82}}>Tiny Todo List</text>
                            </symbol>

                            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#title" id="path_1"/>
                            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#title" id="path_2"/>

                        </svg>
                    </div>

                    <div className="content">
                        <div className="input_text">
                            <div className="input_type">
                                <RaisedButton
                                    onTouchTap={this.handleOpenSearchMenu}
                                    label={this.state.input_type}
                                />
                                <Popover
                                    open={this.state.search_menu_open}
                                    anchorEl={this.state.search_anchorEl}
                                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                    onRequestClose={this.handleRequestCloseSearchMenu}
                                    animation={PopoverAnimationVertical}
                                >
                                    <Menu>
                                        <MenuItem primaryText="Add"
                                                  onTouchTap={() => this.handleSelectSearch('Add')} />
                                        <MenuItem primaryText="Tag"
                                                  onTouchTap={() => this.handleSelectSearch('Tag')}/>
                                        <MenuItem primaryText="Content"
                                                  onTouchTap={() => this.handleSelectSearch('Content')}/>
                                    </Menu>
                                </Popover>
                            </div>
                            <TextField
                                hintText="What needs to be done ?"
                                fullWidth={true}
                                value={this.state.task_input}
                                onChange={this.handleInputText}
                                onKeyDown={(event) => {
                                    if(event && event.keyCode === 13) {
                                        this.handleAddTask(this.state.task_input);
                                    }
                                }}
                            /><br />
                        </div>
                        <Paper zDepth={1} >
                            {this.state.todo_list.length > 0 ? <div className="list_items">
                                {this.state.display_list.map((item, index) => (
                                    <div className="list_item" key={index}>
                                        <div className="list_item__checkbox" >
                                            <Checkbox
                                                checked={item.done}
                                                onCheck={(event, isInputChecked) =>
                                                    this.handleCheckTask(index, isInputChecked)}
                                            />
                                        </div>
                                        <div className={`list_item__content ${item.done ? 'list_item__content--done' : ''}`}>{item.content}</div>
                                        <div className="list_item__tag"><Chip>{item.tag}</Chip></div>
                                        <div className="list_item__btn__edit">
                                            <IconButton onTouchTap={() => this.refs['taskEditDialog'].handleOpen(item,
                                                this.state.todo_list.indexOf(item))}>
                                                <EditorModeEdit />
                                            </IconButton>
                                            <IconButton onTouchTap={() => this.handleRemoveTask(index)} >
                                                <ActionDeleteForever />
                                            </IconButton>
                                        </div>
                                    </div>
                                ))}
                                <div className="list_footer">
                                    <div>{this.handleCountUnCompletedTask()} item left</div>
                                    <div>
                                        <span>Filter: </span>
                                        <RaisedButton
                                            onTouchTap={this.handleOpenFilterMenu}
                                            label={this.state.filter}
                                            disabled={this.state.search_mode}
                                        />
                                        <Popover
                                            open={this.state.filter_menu_open}
                                            anchorEl={this.state.anchorEl}
                                            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                            targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                            onRequestClose={this.handleRequestCloseFilterMenu}
                                            animation={PopoverAnimationVertical}
                                        >
                                            <Menu>
                                                <MenuItem primaryText="All"
                                                          onTouchTap={() => this.handleSelectFilter('All')} />
                                                <MenuItem primaryText="Active"
                                                          onTouchTap={() => this.handleSelectFilter('Active')}/>
                                                <MenuItem primaryText="Completed"
                                                          onTouchTap={() => this.handleSelectFilter('Completed')}/>
                                            </Menu>
                                        </Popover>
                                    </div>
                                    <div>
                                        <RaisedButton label="Clear completed" onTouchTap={this.handleClearCompleted} />
                                    </div>
                                </div>
                            </div> : <div className="empty">There is no task here.<br/>Create one?</div>}
                        </Paper>
                    </div>
                    <TaskEditDialog ref="taskEditDialog" modify={this.handleUpdateTask} />
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
