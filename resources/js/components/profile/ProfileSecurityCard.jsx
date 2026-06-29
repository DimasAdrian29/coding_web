export default function ProfileSecurityCard({ formData, onChange }) {
    return (
        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                <h4 className="text-lg font-bold">Ubah Password</h4>
            </div>

            <div className="p-6">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            Password Lama
                        </label>
                        <input
                            name="oldPassword"
                            type="password"
                            value={formData.oldPassword}
                            onChange={onChange}
                            placeholder="Masukkan password saat ini"
                            className="w-full rounded-lg border-slate-200 bg-slate-50 transition-all focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                Password Baru
                            </label>
                            <input
                                name="newPassword"
                                type="password"
                                value={formData.newPassword}
                                onChange={onChange}
                                placeholder="Minimal 8 karakter"
                                className="w-full rounded-lg border-slate-200 bg-slate-50 transition-all focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                Konfirmasi Password Baru
                            </label>
                            <input
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={onChange}
                                placeholder="Ulangi password baru"
                                className="w-full rounded-lg border-slate-200 bg-slate-50 transition-all focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
