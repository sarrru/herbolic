const mfaOtpTemplate = (otp) => {
  return `
    <div>
      <h3>Multi-Factor Authentication Code</h3>
      <p>Your verification code is:</p>
      <h2>${otp}</h2>
      <p>This code will expire in 5 minutes.</p>
    </div>
  `;
};

export default mfaOtpTemplate;
