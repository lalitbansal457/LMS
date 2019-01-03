var nodemailer = require('nodemailer');

exports.sendEmail = function(to, subject, text) {
	var transporter = nodemailer.createTransport({
	  host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
	  auth: {
	    user: 'lalit.bansal454@gmail.com',
	    pass: 'babubhudhu'
	  }
	});

	var mailOptions = {
	  from: 'lalit.bansal454@gmail.com',
	  to: to,
	  subject: subject,
	  text: text
	};

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    //console.log('error', error);

	    return error;
	  } else {

	    console.log('Email sent: ' + info.response);

	    return info.response;
	  }
	});
} 