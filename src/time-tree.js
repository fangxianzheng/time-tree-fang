class TimeTree {
  constructor({startDate, endDate, span = 1}) {
    this.startDate = this.toDateObj(startDate)
    this.endDate = this.toDateObj(endDate)
    this.span = span

    this.startYear = this.startDate.getFullYear()
    this.startMonth = this.startDate.getMonth() + 1      // 月份是从0开始的
    this.startDay = this.startDate.getDate()
    this.startHour = this.startDate.getHours()
    this.startMinutes = this.startDate.getMinutes()

    this.endYear = this.endDate.getFullYear()
    this.endMonth = this.endDate.getMonth() + 1      // 月份是从0开始的
    this.endDay = this.endDate.getDate()
    this.endHour = this.endDate.getHours()
    this.endMinutes = this.endDate.getMinutes()

    this.yearArr = []
    this.monthArr = {}
    this.dayArr = {}
    this.hourArr = {}
    this.minuteArr = {}

    this.init()
  }

  init () {
    this.yearArr = this.getYearArr()
    this.monthArr = this.getMonthArr()
    this.dayArr = this.getDayArr()
    this.hourArr = this.getHourArr()
    this.minuteArr = this.getMinuteArr()
  }

  getYearArr () {
    let arr = []
    for (let i = this.startYear; i <= this.endYear; i ++) {
      arr.push(i)
    }
    return arr
  }

  getMonthArr () {
    let obj = {}

    this.yearArr.forEach((year) => {
      obj[year] = []

      // 如果是一年内
      if (this.startYear == this.endYear) {
        for (let i = this.startMonth; i <= this.endMonth; i ++) {
          obj[year].push(i)
        }
      } else if (year == this.startYear) {
        for (let i = this.startMonth; i <= 12; i ++) {
          obj[year].push(i)
        }
      } else if (year == this.endYear) {
        for (let i = 1; i <= this.endMonth; i ++) {
          obj[year].push(i)
        }
      } else {
        for (let i = 1; i <= 12; i ++) {
          obj[year].push(i)
        }
      }

      // 删除空的数组（因为span存在，所以可能有空数组）
      if (!obj[year].length) {
        delete obj[year]
      }

    })

    return obj
  }

  getDayArr () {
    let obj = {}
    for (let year in this.monthArr) {

      // 是否是闰年
      let yearNum =  parseInt(year)
      let isLeapYear = (yearNum % 4 == 0 && yearNum % 100 != 0) || yearNum % 400 == 0
      obj[year] = {}
      this.monthArr[year].forEach((month) => {
        obj[year][month] = []
        let lastDay = null
        if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
          lastDay = 31
        }
        if (month === 4 || month === 6 || month === 9 || month === 11) {
          lastDay = 30
        }
        if (month === 2) {
          lastDay = isLeapYear ? 29 : 28
        }

        // 如果时间跨度是同一个月
        if (this.startYear == this.endYear && this.startMonth == this.endMonth) {
          for (let i = this.startDay; i <= this.endDay; i ++) {
            obj[year][month].push(i)
          }
        } else if (year == this.startYear && month == this.startMonth) {
          for (let i = this.startDay; i <= lastDay; i ++) {
            obj[year][month].push(i)
          }
        }else if (year == this.endYear && month == this.endMonth) {
          for (let i = 1; i <= this.endDay; i ++) {
            obj[year][month].push(i)
          }
        } else {
          for (let i = 1; i <= lastDay; i ++) {
            obj[year][month].push(i)
          }
        }

        // 删除空的数组（因为span存在，所以可能有空数组）
        if (!obj[year][month].length) {
          delete obj[year][month]
        }

      })

    }
    return obj
  }

  getHourArr () {
    let obj = {}
    for (let year in this.dayArr) {
      obj[year] = {}
      for (let month in this.dayArr[year]) {
        obj[year][month] = {}
        this.dayArr[year][month].forEach((day) => {
          obj[year][month][day] = []

          // 如果时间跨度是一天内
          if (this.startYear == this.endYear && this.startMonth == this.endMonth && this.startDay == this.endDay) {
            for (let i = this.startHour; i <= this.endHour; i ++) {
              obj[year][month][day].push(i)
            }
          } else if (year == this.startYear && month == this.startMonth && day == this.startDay) {
            for (let i = this.startHour; i <= 24; i ++) {
              obj[year][month][day].push(i)
            }
          } else if (year == this.endYear && month == this.endMonth && day == this.endDay) {
            for (let i = 1; i <= this.endHour; i ++) {
              obj[year][month][day].push(i)
            }
          } else {
            for (let i = 0; i <= 23; i ++) {
              obj[year][month][day].push(i)
            }
          }

          // 删除空的数组（因为span存在，所以可能有空数组）
          if (!obj[year][month][day].length) {
            delete obj[year][month][day]
          }

        })
      }
    }
    return obj
  }

  getMinuteArr () {
    let obj = {}
    let startMinutes = Math.round(Math.ceil(this.startMinutes / this.span) * this.span)
    let endMinutes = Math.round(Math.floor(this.endMinutes / this.span) * this.span)
    for (let year in this.hourArr) {
      obj[year] = {}
      for (let month in this.hourArr[year]) {
        obj[year][month] = {}
        for (let day in this.hourArr[year][month]) {
          obj[year][month][day] = {}
          this.hourArr[year][month][day].forEach((hour) => {
            obj[year][month][day][hour] = []

            // 如果时间跨度是一个小时之内
            if (this.startYear == this.endYear && this.startMonth == this.endMonth && this.startDay == this.endDay && this.startHour == this.endHour) {
              for (let i = startMinutes; i <= endMinutes; i += this.span) {
                obj[year][month][day][hour].push(i)
              }
            } else if (year == this.startYear && month == this.startMonth && day == this.startDay && hour == this.startHour) {
              for (let i = startMinutes; i <= 59; i += this.span) {
                obj[year][month][day][hour].push(i)
              }
            } else if (year == this.endYear && month == this.endMonth && day == this.endDay && hour == this.endHour) {
              for (let i = 0; i <= endMinutes; i += this.span) {
                obj[year][month][day][hour].push(i)
              }
            } else {
              for (let i = 0; i <= 59; i += this.span) {
                obj[year][month][day][hour].push(i)
              }
            }

            // 删除空的数组（因为span存在，所以可能有空数组）
            if (!obj[year][month][day][hour].length) {
              delete obj[year][month][day][hour]
            }

          })
        }
      }
    }

    return obj
  }

  toDateObj (value) {
    let newValue = value
    if (typeof value === 'string') {
      newValue = value.replace(/-/g, '/')
    }
    return new Date(newValue)
  }

}

export default TimeTree