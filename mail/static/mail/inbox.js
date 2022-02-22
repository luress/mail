document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email(id=undefined) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#emails-info').style.display = 'none';

  if (id !== undefined) {
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    // Load message info
    document.querySelector('#compose-recipients').value = `${email.recipients}`;
    document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
    document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} write: ${email.body}`;
    document.querySelector('#compose-form').onsubmit = function() { 
      send_email()
      
  };
    
});
  } else {
  // Clear out composition fields

  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  document.querySelector('#compose-form').onsubmit = function() { 
    send_email()
    
};  }
}

function view_email(ids, mailbox) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-info').style.display = 'block';
  reply = document.querySelector('#reply')
  reply.addEventListener('click', function() {
    compose_email(ids)
  })
  if (mailbox === "sent") {
    document.querySelector("#archive_add").style.display = 'none';
  } else if (mailbox === "archive") {
    document.querySelector("#archive_add").style.display = 'block';
    const button = document.querySelector('#archive_add');
    button.innerHTML = 'Remove from archive'
    button.addEventListener('click', function() {
      fetch(`/emails/${ids}`, {
        method: 'PUT',
        body: JSON.stringify({
            archived: false
        })
      })

      document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#emails-info').style.display = 'none';
    });
  } else {
    document.querySelector("#archive_add").style.display = 'block';
    const button = document.querySelector('#archive_add');
    button.innerHTML = 'Add to archive'
    document.querySelector('#archive_add').addEventListener('click', function() {
    fetch(`/emails/${ids}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: true
      })
    })
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#emails-info').style.display = 'none';
  });
}
  

  fetch(`/emails/${ids}`)
  .then(response => response.json())
  .then(email => {
    // Load message info
    const msg_info_sender = document.querySelector("#msg_info_sender");
    const msg_info_recipients = document.querySelector("#msg_info_recipients");
    const msg_info_subject = document.querySelector("#msg_info_subject");
    const msg_info_time = document.querySelector("#msg_info_time");
    const msg_info_body = document.querySelector("#msg_info_body");
    msg_info_sender.innerHTML = `<b>From</b>: ${email.sender}`;
    msg_info_recipients.innerHTML = `<b>To</b>: ${email.recipients}`;
    msg_info_subject.innerHTML = `<b>Subject</b>: ${email.subject}`;
    msg_info_time.innerHTML = `<b>Timestamp</b>: ${email.timestamp}`;
    msg_info_body.innerHTML = `<br>${email.body}`;
    
    
});
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-info').style.display = 'none';
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Load all messages
    for(var i = 0; i < emails.length; i++) {
      const area = document.createElement('div');
      
      const id = emails[i].id
      const sender = document.createElement('div');
      const subject = document.createElement('div');
      const timestamp = document.createElement('div');
      area.className = "email-area"
      if (emails[i].read === true) {
        area.style.color = 'green'
      }
      else {
        area.style.color = 'gray'
      }
      sender.className = "email-id";
      subject.className = "email-subject";
      timestamp.className = "email-timestamp"
      sender.innerHTML = emails[i].sender;
      subject.innerHTML =  emails[i].subject;
      timestamp.innerHTML = emails[i].timestamp;
      area.addEventListener('click', function() {
        view_email(id, mailbox)
        fetch(`/emails/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
              read: true
          })
        })
    });
      const ul = document.querySelector('#emails-view');
      area.append(sender);
      area.append(subject);
      area.append(timestamp);
      ul.append(area)
      
    }

    
});
}

function send_email() {
  const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: `${recipients}`,
          subject: `${subject}`,
          body: `${body}`
      })
    })
    .then(response => response.json())
    .then(result => {
        alert(result);
    });
    
  }

function reply_email() {

}