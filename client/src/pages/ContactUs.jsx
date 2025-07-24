import React from 'react';

const ContactUs = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Contact With Us</h2>
        <p className="text-gray-600 mt-2">
          You can ask us questions
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Contact us for all your questions and opinions, or you can solve your problems in a shorter time with our contact offices.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Left: Office Info */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Our Office</h3>
          <p className="text-gray-600 mb-2">
            Visit or contact us anytime for inquiries, feedback, or support. We're here to help and ensure your experience with Taja is seamless.
          </p>
          <div className="mt-4 space-y-2">
            <p className="flex items-center gap-2">
              📍 <span>Dhapakhel, Lalitpur</span>
            </p>
            <p className="ml-6 text-sm text-gray-600">Dhapakhel-Devi Mandir marg</p>
            <p className="ml-6 text-sm text-gray-600">+02 1234 567 88</p>
            <p className="ml-6 text-sm text-gray-600">taja@gmail.com</p>
          </div>
          <div className="flex gap-4 mt-4 ml-6">
            {/* Social Icons */}
            <a href="#" className="text-blue-600">📘</a>
            <a href="#" className="text-blue-400">🐦</a>
            <a href="#" className="text-blue-500">💼</a>
            <a href="#" className="text-blue-600">📷</a>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Feel free to reach us</h3>
          <form className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Your name *" className="border p-2 rounded" required />
              <input type="email" placeholder="Your email *" className="border p-2 rounded" required />
            </div>
            <input type="text" placeholder="Subject *" className="border p-2 rounded" required />
            <textarea placeholder="Your message" rows="5" className="border p-2 rounded"></textarea>
            <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 w-max">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
