import { useState, useEffect, useRef } from 'react'

type TimerMode = 'work' | 'shortBreak' | 'longBreak'

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState<TimerMode>('work')
  const [pomodoroCount, setPomodoroCount] = useState(0)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 타이머 모드별 시간 설정
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
                // 타이머 종료 처리
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

      // 4번째 뽀모도로 후 긴 휴식
      if (newCount % 4 === 0) {
        switchMode('longBreak')
      } else {
        switchMode('shortBreak')
      }
    } else {
      switchMode('work')
    }

    // 알림 (선택사항)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-96">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Pomodoro Timer
        </h1>

        {/* 모드 선택 버튼 */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => switchMode('work')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
              mode === 'work'
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Work
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
              mode === 'shortBreak'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Short Break
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
              mode === 'longBreak'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Long Break
          </button>
        </div>

        {/* 타이머 디스플레이 */}
        <div className="bg-gray-100 rounded-2xl p-12 mb-8">
          <div className="text-7xl font-bold text-center text-gray-800">
            {formatTime(minutes)}:{formatTime(seconds)}
          </div>
        </div>

        {/* 컨트롤 버튼 */}
        <div className="flex gap-4">
          <button
            onClick={toggleTimer}
            className={`flex-1 py-4 rounded-xl font-bold text-white text-lg transition-colors ${
              isActive
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className="flex-1 py-4 rounded-xl font-bold text-white text-lg bg-red-500 hover:bg-red-600 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* 뽀모도로 카운트 */}
        <div className="mt-6 text-center text-gray-600">
          Pomodoros completed: <span className="font-bold">{pomodoroCount}</span>
        </div>
      </div>
    </div>
  )
}

export default PomodoroTimer
