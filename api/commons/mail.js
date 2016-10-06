const nodemailer = require('nodemailer');
const config = require('../configs');
const privateConfig = require('../configs/private');
const utils = require('./utils');

const mailUtil = {};

var transporter = nodemailer.createTransport(privateConfig.smtp);

mailUtil.sendTestimonialToSubmit = (submit, website, category, subcategory) => {
  if (process.env.NODE_ENV !== 'test' && privateConfig.email.sender) {
    const sendCommentMention = transporter.templateSender({
      subject: '[八度导航] 您分享的站点已收录',
      from: privateConfig.email.sender,
      text: '您好！\n您在「八度导航」中分享的站点「{{ website_name }}」 {{ website_url }} 已收入 「{{ category_name }}」-> 「{{ subcategory_name }}」分类。\n感谢您的分享！',
      html: '' +
      '<p>您好！</p>' +
      '<p>您在「八度导航」中分享的站点「{{ website_name }}」 <a href="{{ website_url }}">{{ website_url }}</a> 已收入 「{{ category_name }}」->「{{ subcategory_name }}」分类。</p>' +
      '<p>感谢您的分享！</p>' +
      '<p style="text-align: right;">八度导航</p>' +
      '<p style="text-align: right;">{{ date }}</p>'
    });

    sendCommentMention({
      to: submit.email
    }, {
      website_name: website.name,
      website_url: website.url,
      category_name: category.name,
      subcategory_name: subcategory.name,
      date: utils.dateFormat(new Date())
    }, senderHandle);
  }
}

function senderHandle(err, info) {
  if(err){
    console.log(err);
  }else{
    console.log('Send email success');
  }
}


module.exports = mailUtil;