// import { Resend } from 'resend';
// import dotenv from 'dotenv'
// dotenv.config()

// if(!process.env.RESEND_API){
//     console.log("Provide RESEND_API in side the .env file")
// }

// const resend = new Resend(process.env.RESEND_API);

// const sendEmail = async({sendTo, subject, html })=>{
//     try {
//         const { data, error } = await resend.emails.send({
//            from: 'Blinkit Support <noreply@on.resend.com>',
//             to: sendTo,
//             subject: subject,
//             html: html,
//         });

//         if (error) {
//             return console.error({ error });
//         }

//         return data
//     } catch (error) {
//         console.log(error)
//     }
// }

// export default sendEmail


import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API);

// THIS IS THE ULTIMATE TEST FUNCTION
const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        // We are using a BRAND NEW, UNIQUE 'from' address
        const uniqueFromAddress = 'Final Test Version <test-123-ok@on.resend.com>';

        console.log("-----------------------------------------");
        console.log("RUNNING THE LATEST VERSION OF sendEmail.js");
        console.log("USING THIS FROM ADDRESS:", uniqueFromAddress);
        console.log("-----------------------------------------");

        const { data, error } = await resend.emails.send({
            from: 'Herbolic Support <onboarding@resend.dev>',
            to: sendTo, // ✅ This line was missing!
            subject: subject,
            html: html,
        });


        if (error) {
            console.error("Resend API Error:", { error });
            return { error };
        }

        console.log("SUCCESS! Email sent successfully via Resend.");
        return data;
    } catch (error) {
        console.error("Critical error in sendEmail function:", error);
        return { error };
    }
};

export default sendEmail;