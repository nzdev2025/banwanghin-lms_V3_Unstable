// src/views/LoginView.jsx
import React, { useState } from 'react';
import Icon from '../icons/Icon';
import { handleLogin, handleSignUp } from '../firebase/firebase';

const LoginView = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await handleLogin(email, password);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    // หมายเหตุ: ในระบบจริงอาจจะต้องมีหน้าสำหรับสมัครสมาชิกโดยเฉพาะ
    // แต่เพื่อความรวดเร็ว เราจะใส่ฟังก์ชันสมัครไว้ที่นี่ชั่วคราว
    const onSignUp = async () => {
        setIsLoading(true);
        setError('');
        try {
            await handleSignUp(email, password);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">KruKit (ครูคิท)</h1>
                    <p className="text-gray-400">กรุณาเข้าสู่ระบบเพื่อใช้งาน</p>
                </div>
                
                <form onSubmit={onLogin} className="bg-gray-800/50 backdrop-blur-lg border border-white/10 shadow-2xl rounded-2xl p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">อีเมล</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">รหัสผ่าน</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500" 
                            required 
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-500"
                    >
                        {isLoading ? <Icon name="Loader2" className="animate-spin"/> : 'เข้าสู่ระบบ'}
                    </button>

                     <p className="text-xs text-gray-500 text-center">
                        หากยังไม่มีบัญชี, กรอกอีเมลและรหัสผ่านแล้วคลิก 
                        <span onClick={onSignUp} className="text-sky-400 hover:underline cursor-pointer">
                            ที่นี่เพื่อสร้างบัญชีใหม่
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginView;