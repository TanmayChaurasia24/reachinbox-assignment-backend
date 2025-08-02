import axios from "axios";


export const sendSlackNotification = async (email: {
    subject: string;
    from_name: string;
    from_email: string;
    content: string;
}) => {
    try {
        const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL!
        console.log("url is: ", SLACK_WEBHOOK_URL);
    
    const message = {
      text: `🟢 *New Interested Email*`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*From:* ${email.from_name} <${
              email.from_email
            }>\n*Subject:* ${email.subject}\n\n${email.content.slice(0,300)}...`,
          },
        },
      ],
    };

    await axios.post(SLACK_WEBHOOK_URL, message);
  } catch (error) {
    // console.error("Failed to send Slack notification:", error);
    return;
  }
};
