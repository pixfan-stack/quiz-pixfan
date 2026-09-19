  return (
    <section className="home">
      <header className="home-hero">
        <p className="home-hero__eyebrow">
          <span className="home-hero__eyebrow-dot" aria-hidden="true" />
          {t('app.title')}
        </p>
        <h2 className="page-title">{t('home.welcome')}</h2>
        <p className="page-subtitle">{t('home.selectQuiz')}</p>
      </header>

      {/* Settings toggle */}
      <div className="quiz-settings-bar">
        <PlayerNamePrompt
          recoveryCode={recoveryCode}
          onRecovered={onRecovered}
        />
        <button
          type="button"
          className="btn btn--ghost btn--small"
          onClick={() => setShowSettings(!showSettings)}
          aria-expanded={showSettings}
        >
          ⚙️ {t('home.settings')}
        </button>

        {showSettings && (
          <div className="quiz-settings-panel">
