export default function ThankYouPage() {
    return (
        <div className="container py-20">
            <div className="max-w-2xl mx-auto text-center fade-in">
                <div className="glass-card">
                    <div className="text-6xl mb-6">🎉</div>
                    <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
                    <p className="text-xl text-secondary mb-8">
                        Your application and assessment have been submitted successfully.
                    </p>

                    <div className="bg-green-500 bg-opacity-10 border border-green-500 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold mb-2 text-green-400">What's Next?</h3>
                        <p className="text-secondary">
                            Our HR team will review your application and assessment results.
                            If your profile matches our requirements, we will contact you via email or phone within 5-7 business days.
                        </p>
                    </div>

                    <div className="text-left space-y-3 text-sm text-secondary">
                        <p>✓ Application submitted</p>
                        <p>✓ Assessment completed</p>
                        <p>✓ Scores calculated</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
