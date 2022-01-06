import format from 'date-fns/format'

export function filterQuery(query) {
    for (const key in query) {
        if (['', null, undefined].includes(query[key])) {
            delete query[key]
        }
    }
    return query
}


export function formatDate(date, formatStr = 'yyyy-MM-dd') {
    if (!date) {
        return ''
    }
    date = new Date(date)
    if (isNaN(date)) {
        return ''
    }
    return format(date, formatStr)
}

export function validateDate(date, minDate = new Date('1900-01-01T00:00:00'), maxDate = new Date('2099-12-31T00:00:00')) {
    date = new Date(date)
    if (isNaN(date)) {
        return false
    }
    if (date < minDate || date > maxDate) {
        return false
    }
    return true
}