export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">
          Please check your email.
        </h1>
        <p className="text-gray-600">
          To complete your registration, please click the link in the email we
          sent you to activate your account.
        </p>
      </div>
    </div>
  );
}
