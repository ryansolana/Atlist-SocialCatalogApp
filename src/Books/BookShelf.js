import React, { Component } from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import * as firebase from 'firebase'
import BookstoReadShelf from './BookstoReadShelf'

import Notify from './BooksNoteNotify'
import '../App.css'

var email = []

class Shelf extends Component {

    constructor(props) {
        super(props)
        this.state = {
            url: [], title: [], poster: [], id: []
        }
    }

    componentDidMount() {
        var db = firebase.firestore()

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                email.push(user.email)
            } else {
                console.log("No user signed in")
            }
        })

        function sleep(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }

        sleep(1000).then(() => {
            db.collection("users")
                .doc(email[0])
                .collection("books")
                .doc("section")
                .collection("read")
                .get()
                .then(querySnapshot => {
                    const data = querySnapshot.docs.map(doc => doc.data())
                    for (var i = 0; i < data.length; i++) {
                        this.state.id.push(`/book/detail/${data[i].bookID}`)
                        this.state.url.push(`https://www.googleapis.com/books/v1/volumes?q=isbn:${data[i].bookID}&key=AIzaSyCsBBANgxmahbgmDhSJY_PohBawwQQOOGw`)
                    }
                })
                .then(e => {
                    for (var i = 0; i < this.state.url.length; i++) {
                        fetch(this.state.url[i])
                            .then(dataWrappedByPromise => dataWrappedByPromise.json())
                            .then(data => {
                                this.setState({
                                    title: [...this.state.title, data.items[0].volumeInfo.title],
                                    poster: [...this.state.poster, data.items[0].volumeInfo.imageLinks.thumbnail]
                                }, () => { 
                                })
                            })
                            .catch(function (error) {
                                console.log(error)
                            })
                    }
                })

        })
    }

    /*<tr>
                    {this.state.title.map(function (title, index) {
                        return <td key={index}><h3>{title}</h3></td>
                    })}
    </tr>*/

    createEntityTable = () => {

        let table = [];
        var len = this.state.poster.length
        
        let index = 0;

        // outer loop to create parent
        for (let i = 0; i < len; i++){
            let children = []
            
            // inner loop to create children
            //for (let j = 0; j < len; j++){
            children.push(
                <div id="div_note">
                <Notify title = {this.state.title[i]}/>
                <a href={this.state.id[i]}><img src={this.state.poster[i]}  id="poster_book" alt="poster"></img></a>
                <h2 id = 'title'>{this.state.title[i]}</h2>
                
                </div>)
        
        // if is mutliple of 5 make a new row
           index++
           if (index%5 === 0){
               table.push(<tr></tr>)
           }

           table.push(<td>{children}</td>)
        }

        return table;
    }       


    render() {
        return (
            <div>
                <br />
                <Tabs defaultActiveKey="read" id="uncontrolled-tab-example">
                    <Tab eventKey="read" title="Read">
                        <div>
                            {/*this.state.poster.map(function (poster, index) {
                                if (idx < 5) {
                                    idx++
                                    return <td key={index}><img src={poster} alt="poster"></img></td>
                                }
                                else {
                                    return <span><tr></tr><td key={index}><img src={poster} alt="poster"></img></td></span>
                                }
                            })*/}

                            {this.createEntityTable()}
                        </div>
                    </Tab>
                    <Tab eventKey="to-read" title="To-Read">
                        {<BookstoReadShelf></BookstoReadShelf>}
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default Shelf
