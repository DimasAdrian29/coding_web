export default function ProfilePersonalInfoCard({ formData, teacher, onChange }) {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                <h4 className="text-lg font-bold">Informasi Pribadi</h4>
            </div>

            <div className="p-6">
                <div className="space-y-6">
                    <div className="flex items-center gap-6 border-b border-slate-100 pb-6 dark:border-slate-800">
                        <div className="group relative">
                            <div
                                className="h-24 w-24 rounded-full border-4 border-white bg-slate-100 bg-cover bg-center shadow-sm dark:border-slate-900 dark:bg-slate-800"
                                style={{ backgroundImage: `url("${teacher.avatar}")` }}
                            />
                        </div>

                        <div className="space-y-1">
                            <h5 className="text-sm font-bold">Foto Profil</h5>
                            <p className="text-xs text-slate-500">
                                Foto profil guru ditampilkan sebagai informasi akun.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                Nama Lengkap
                            </label>
                            <input
                                name="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={onChange}
                                className="w-full rounded-lg border-slate-200 bg-slate-50 transition-all focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                NIP
                            </label>
                            <input
                                name="nip"
                                type="text"
                                value={formData.nip}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                disabled
                                className="w-full cursor-not-allowed rounded-lg border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                Alamat Email
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-400">
                                    mail
                                </span>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={onChange}
                                    className="w-full rounded-lg border-slate-200 bg-slate-50 pl-10 transition-all focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
