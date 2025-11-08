import { useState, useEffect, useRef } from 'react'

type TimerMode = 'work' | 'shortBreak' | 'longBreak'

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState<TimerMode>('work')
  const [pomodoroCount, setPomodoroCount] = useState(0)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const timeSettings = {
    work: 25,
    shortBreak: 5,
    longBreak: 15,
  }

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            setMinutes((prevMinutes) => {
              if (prevMinutes === 0) {
                handleTimerComplete()
                return 0
              }
              return prevMinutes - 1
            })
            return 59
          }
          return prevSeconds - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive])

  const handleTimerComplete = () => {
    setIsActive(false)

    if (mode === 'work') {
      const newCount = pomodoroCount + 1
      setPomodoroCount(newCount)

      if (newCount % 4 === 0) {
        switchMode('longBreak')
      } else {
        switchMode('shortBreak')
      }
    } else {
      switchMode('work')
    }

    new Audio('/notification.mp3').play().catch(() => {})
  }

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode)
    setMinutes(timeSettings[newMode])
    setSeconds(0)
  }

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setMinutes(timeSettings[mode])
    setSeconds(0)
  }

  const formatTime = (value: number) => {
    return value.toString().padStart(2, '0')
  }

  const getModeColor = () => {
    switch (mode) {
      case 'work':
        return 'from-red-400 to-red-600';
      case 'shortBreak':
        return 'from-blue-400 to-blue-600';
      case 'longBreak':
        return 'from-green-400 to-green-600';
      default:
        return 'from-purple-400 to-purple-600';
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getModeColor()} flex items-center justify-center p-4 transition-colors duration-500`}>
      <div className="w-full max-w-md mx-auto">
        {/* 메인 카드 */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 lg:p-10">
          {/* 헤더 */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              🍅 Pomodoro Timer
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Focus & be productive
            </p>
          </div>

          {/* 모드 선택 버튼 */}
          <div className="flex flex-col sm:flex-row gap-2 mb-6 md:mb-8">
            <button
              onClick={() => switchMode('work')}
              disabled={isActive}
              className={`flex-1 py-2.5 md:py-3 px-3 md:px-4 rounded-lg md:rounded-xl font-semibold text-sm md:text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                mode === 'work'
                  ? 'bg-red-500 text-white shadow-lg scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-95'
              }`}
            >
              Work
            </button>
            <button
              onClick={() => switchMode('shortBreak')}
              disabled={isActive}
              className={`flex-1 py-2.5 md:py-3 px-3 md:px-4 rounded-lg md:rounded-xl font-semibold text-sm md:text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                mode === 'shortBreak'
                  ? 'bg-blue-500 text-white shadow-lg scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-95'
              }`}
            >
              Short Break
            </button>
            <button
              onClick={() => switchMode('longBreak')}
              disabled={isActive}
              className={`flex-1 py-2.5 md:py-3 px-3 md:px-4 rounded-lg md:rounded-xl font-semibold text-sm md:text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                mode === 'longBreak'
                  ? 'bg-green-500 text-white shadow-lg scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-95'
              }`}
            >
              Long Break
            </button>
          </div>

          {/* 타이머 디스플레이 */}
          <div className="relative mb-6 md:mb-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl md:rounded-3xl p-8 md:p-12 lg:p-16 shadow-inner">
              <div className="text-center">
                <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-gray-800 tracking-tight tabular-nums">
                  {formatTime(minutes)}:{formatTime(seconds)}
                </div>
                <div className="mt-3 md:mt-4 text-xs sm:text-sm md:text-base text-gray-500 uppercase tracking-wider font-medium">
                  {mode === 'work' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                </div>
              </div>
            </div>

            {/* 진행 바 */}
            <div className="mt-4 md:mt-6 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  mode === 'work' ? 'bg-red-500' :
                    mode === 'shortBreak' ? 'bg-blue-500' : 'bg-green-500'
                }`}
                style={{
                  width: `${((timeSettings[mode] * 60 - minutes * 60 - seconds) / (timeSettings[mode] * 60)) * 100}%`
                }}
              />
            </div>
          </div>

          {/* 컨트롤 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6">
            <button
              onClick={toggleTimer}
              className={`flex-1 py-3 md:py-4 px-6 rounded-xl md:rounded-2xl font-bold text-white text-base md:text-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
              }`}
            >
              {isActive ? '⏸️ Pause' : '▶️ Start'}
            </button>
            <button
              onClick={resetTimer}
              className="flex-1 sm:flex-initial sm:px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-white text-base md:text-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
            >
              🔄 Reset
            </button>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-purple-600">
                {pomodoroCount}
              </div>
              <div className="text-xs md:text-sm text-purple-600 mt-1 font-medium">
                Completed
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-600">
                {Math.floor((pomodoroCount * 25) / 60)}h {(pomodoroCount * 25) % 60}m
              </div>
              <div className="text-xs md:text-sm text-indigo-600 mt-1 font-medium">
                Focus Time
              </div>
            </div>
          </div>
        </div>

        {/* 푸터 팁 */}
        <div className="mt-4 md:mt-6 text-center text-white/90 text-xs md:text-sm px-4">
          <p className="drop-shadow-lg">
            💡 Tip: Take regular breaks to maintain focus and productivity
          </p>
        </div>
      </div>
    </div>
  )
}

export default PomodoroTimer
