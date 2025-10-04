import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AuthRedirectUpdate: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 rounded-lg text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('authRedirectUpdate.title')}</h1>
          <p className="text-lg opacity-90">{t('authRedirectUpdate.description')}</p>
        </div>

        {/* Success Status */}
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <span className="text-xl mr-2">✅</span>
            <strong>{t('authRedirectUpdate.successMessage')}</strong>
          </div>
          <p className="mt-2">{t('authRedirectUpdate.successDescription')}</p>
        </div>

        {/* Updated Authentication Flow */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <span className="mr-2">🔄</span>
            {t('authRedirectUpdate.updatedFlow')}
          </h2>

          {/* Sign In Flow */}
          <div className="flex items-center justify-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="bg-white p-4 rounded-lg shadow-sm text-center min-w-[120px]">
              <strong>{t('authRedirectUpdate.signIn')}</strong><br />
              <small className="text-gray-600">/signin</small>
            </div>
            <div className="text-2xl text-blue-500">→</div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center min-w-[120px]">
              <strong>{t('authRedirectUpdate.success')}</strong><br />
              <small className="text-gray-600">{t('authRedirectUpdate.authentication')}</small>
            </div>
            <div className="text-2xl text-blue-500">→</div>
            <div className="bg-green-50 p-4 rounded-lg shadow-sm text-center min-w-[120px] border border-green-200">
              <strong>{t('authRedirectUpdate.homePage')}</strong><br />
              <small className="text-gray-600">/home</small>
            </div>
          </div>

          {/* Registration Flow */}
          <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="bg-white p-4 rounded-lg shadow-sm text-center min-w-[120px]">
              <strong>{t('authRedirectUpdate.register')}</strong><br />
              <small className="text-gray-600">/register</small>
            </div>
            <div className="text-2xl text-blue-500">→</div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center min-w-[120px]">
              <strong>{t('authRedirectUpdate.accountCreated')}</strong><br />
              <small className="text-gray-600">{t('authRedirectUpdate.autoSignIn')}</small>
            </div>
            <div className="text-2xl text-blue-500">→</div>
            <div className="bg-green-50 p-4 rounded-lg shadow-sm text-center min-w-[120px] border border-green-200">
              <strong>{t('authRedirectUpdate.homePage')}</strong><br />
              <small className="text-gray-600">/home</small>
            </div>
          </div>
        </div>

        {/* Changes Made */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <span className="mr-2">📝</span>
            {t('authRedirectUpdate.changesMade')}
          </h2>

          {/* Sign In Page */}
          <h3 className="text-xl font-semibold mb-3">{t('authRedirectUpdate.signInPage')}</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-semibold text-red-600 mb-2">❌ {t('authRedirectUpdate.before')}</h4>
              <p className="mb-2">{t('authRedirectUpdate.signInBeforeDesc')}</p>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                <div>toast(&#123;</div>
                <div>&nbsp;&nbsp;title: t('auth.signInSuccess'),</div>
                <div>&nbsp;&nbsp;description: "You have successfully signed in.",</div>
                <div>&#125;);</div>
                <div>navigate('/');  // ← Root page</div>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h4 className="font-semibold text-green-600 mb-2">✅ {t('authRedirectUpdate.after')}</h4>
              <p className="mb-2">{t('authRedirectUpdate.signInAfterDesc')}</p>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                <div>toast(&#123;</div>
                <div>&nbsp;&nbsp;title: t('auth.signInSuccess'),</div>
                <div>&nbsp;&nbsp;description: "You have successfully signed in.",</div>
                <div>&#125;);</div>
                <div>navigate('/home');  // ← Home page</div>
              </div>
            </div>
          </div>

          {/* Register Page */}
          <h3 className="text-xl font-semibold mb-3">{t('authRedirectUpdate.registerPage')}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-semibold text-red-600 mb-2">❌ {t('authRedirectUpdate.before')}</h4>
              <p className="mb-2">{t('authRedirectUpdate.registerBeforeDesc')}</p>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                <div>toast(&#123;</div>
                <div>&nbsp;&nbsp;title: t('auth.accountCreated'),</div>
                <div>&nbsp;&nbsp;description: t('auth.accountCreatedDesc'),</div>
                <div>&#125;);</div>
                <div>navigate('/');  // ← Root page</div>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h4 className="font-semibold text-green-600 mb-2">✅ {t('authRedirectUpdate.after')}</h4>
              <p className="mb-2">{t('authRedirectUpdate.registerAfterDesc')}</p>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                <div>toast(&#123;</div>
                <div>&nbsp;&nbsp;title: t('auth.accountCreated'),</div>
                <div>&nbsp;&nbsp;description: t('auth.accountCreatedDesc'),</div>
                <div>&#125;);</div>
                <div>navigate('/home');  // ← Home page</div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <span className="mr-2">🎯</span>
            {t('authRedirectUpdate.benefits')}
          </h2>
          <ul className="space-y-2">
            {[t('authRedirectUpdate.benefitsList.0'), t('authRedirectUpdate.benefitsList.1'), t('authRedirectUpdate.benefitsList.2'), t('authRedirectUpdate.benefitsList.3'), t('authRedirectUpdate.benefitsList.4')].map((benefit, index) => (
              <li key={index} className="flex items-start border-b border-gray-100 pb-2">
                <span className="text-green-500 mr-2">✅</span>
                <div>{benefit}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Ready Status */}
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <span className="text-xl mr-2">🚀</span>
            <strong>{t('authRedirectUpdate.readyForTesting')}</strong>
          </div>
          <p className="mt-2">{t('authRedirectUpdate.readyDescription')}</p>
        </div>

        {/* Test Links */}
        <div className="text-center space-x-4">
          <Link to="/signin" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            🔐 {t('authRedirectUpdate.testSignIn')}
          </Link>
          <Link to="/register" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            📝 {t('authRedirectUpdate.testRegister')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthRedirectUpdate;
