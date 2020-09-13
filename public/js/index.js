const db = firebase.firestore()

var provider = new firebase.auth.GoogleAuthProvider();
var userLogin

db.collection('books').onSnapshot(snapshot=>{
    var content=''
    var id=1
    snapshot.forEach(book=>{
        content+='<tr>'
        content+='<th scope="row">'+id+ '</th>'
        content+='<td>'+ book.data().title +'</td>'
        if(book.data().author){
            content+='<td>'+book.data().author.name+ ' ' + book.data().author.lastname+ '</td>'
        }else{
            content+='<td></td>'
        }
        content+='<td>'+ book.data().year +'</td>'
        content+='<td>'+ book.data().user.name +'</td>'
        const userModName = (book.data().userMod) ? book.data().userMod.name : ''
        content+='<td>'+ userModName +'</td>'
        content+='<td>'
        content+='<button class="btn btn-light my-2 my-sm-0" onclick="deleteBook(\'' +book.id  +'\')">Delete</button>'
        content+='<button class="btn btn-light my-2 my-sm-0" onclick="openEdit(\'' +book.id  +'\')">Edit</button>'
        content+='</td>'
        content+='</tr>'
        id++
    })
    $('#database').empty()
    $('#database').html(content)
})

function deleteBook(id){
    db.collection('books').doc(id).delete()
}

function addBook(){
    const bookId=$('#book-id').val()
    if(bookId==''){
        db.collection('books').add({
            title:$('#book-title').val(),
            author:{
                name:$('#book-author-name').val(),
                lastname:$('#book-author-lastname').val()
            },
            year:$('#book-year').val(),
            user:{
                email:userLogin.email,
                name:userLogin.displayName
            }
        })    
    }else{
        db.collection('books').doc(bookId).update({
            title:$('#book-title').val(),
            author:{
                name:$('#book-author-name').val(),
                lastname:$('#book-author-lastname').val()
            },
            year:$('#book-year').val(),
            userMod:{
                email:userLogin.email,
                name:userLogin.displayName
            }
        })
    }
    $('#book-title').val('')
    $('#book-author-name').val('')
    $('#book-author-lastname').val('')
    $('#book-year').val('')
    $('#book-id').val('')
}

function login(){
    firebase.auth().signInWithRedirect(provider).then(result=> {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      }).catch(error=> {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });    
}

//listener

firebase.auth().onAuthStateChanged(user=>{
    if(user){
        userLogin=user
        $('#div-navbar').show()
        $('#div-login').show()
        $('#div-logout').hide()
        $('#div-loading').hide()
        $('#user-name').text(userLogin.displayName)
        $("#user-image").attr("src",userLogin.photoURL)
    }else{
        $('#div-navbar').hide()
        $('#div-login').hide()
        $('#div-logout').show()
        $('#div-loading').hide()
    }
})

$( document ).ready( ()=>{
    $('#div-loading').show()
    $('#div-navbar').hide()
    $('#div-login').hide()
    $('#div-logout').hide()
})

function logout(){
    firebase.auth().signOut().then(()=>{
        userLogin=null
    })
}

function openAdd(){
    
    $('#form-title').text('Add new Book')
    $('#book-id').val('')
    $('#book-title').val('')
    $('#book-author-name').val('')
    $('#book-author-lastname').val('')
    $('#book-year').val('')
    $('#form-add').modal('show')
}

function openEdit(id){
    db.collection('books').doc(id).get().then(snapshot=>{
        const book = snapshot.data()

        $('#form-title').text('Edit Book')
        $('#book-id').val(id)
        $('#book-title').val(book.title)
        $('#book-author-name').val(book.author.name)
        $('#book-author-lastname').val(book.author.lastname)
        $('#book-year').val(book.year)
           
        $('#form-add').modal('show')

    })
}