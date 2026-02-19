export default function ThankYouPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex items-center justify-center py-20 px-4">
            <div className="max-w-2xl mx-auto text-center">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-10 md:p-14">
                    <div className="text-6xl mb-6">🎉</div>
                    <h1 className="text-4xl font-bold mb-4 text-slate-800">Thank You!</h1>
                    <p className="text-xl text-slate-500 mb-8">
                        Your application and assessment have been submitted successfully.
                    </p>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8 text-left">
                        <h3 className="text-lg font-semibold mb-2 text-emerald-700">What&apos;s Next?</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Our HR team will review your application and assessment results.
                            If your profile matches our requirements, we will contact you via email or phone within 5-7 business days.
                        </p>
                    </div>

                    <div className="text-left space-y-3 text-sm">
                        <p className="flex items-center gap-2 text-emerald-600 font-medium">
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 text-xs">✓</span>
                            Application submitted
                        </p>
                        <p className="flex items-center gap-2 text-emerald-600 font-medium">
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 text-xs">✓</span>
                            Assessment completed
                        </p>
                        <p className="flex items-center gap-2 text-emerald-600 font-medium">
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 text-xs">✓</span>
                            Scores calculated
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
