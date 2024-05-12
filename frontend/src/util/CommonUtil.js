import AsyncStorage from '@react-native-async-storage/async-storage';

export const convertStringMsg = (msg) =>{
    switch(msg)
    {
        case 'connect':
            return '연결 됨';
        case 'disconnect':
            return '연결 안됨';
        case 'connecting':
            return '연결 중';
        default:
            return '';
    }
}

export const convertColorCode = (color) =>{
    switch(color)
    {
        case 'connect':
            return '#77d156';
        case 'disconnect':
            return '#d4301e';
        case 'connecting':
            return '#fcba03';
        default:
            return '#000000';
    }
}

const zeroPad = (nr,base) => {
    const len = (String(base).length - String(nr).length)+1;
    return len > 0? new Array(len).join('0')+nr : nr;
}

export const getSecondToString = (second) => {
    if(second == null || second == undefined) return "00:00:00";

    let min = Math.floor(second / 60);
    
    const hour = Math.floor(min / 60);
    const sec = second % 60;

    min = min % 60;

    return zeroPad(hour, 10) + ":" + zeroPad(min, 10) + ":" + zeroPad(sec, 10);
}

export const saveTransactionOnLocalStorage = (tx) => {
    AsyncStorage.getItem('transactionList').then(data=>{
        const jsonData = JSON.parse(data);

        if(jsonData?.transactionList)
        {
            jsonData.transactionList.push(tx);

            AsyncStorage.setItem('transactionList', JSON.stringify(jsonData));
        }
        else
        {
            const createData = {
                transactionList: [tx]
            };
            AsyncStorage.setItem('transactionList', JSON.stringify(createData));
        }
    })
}

export const commaText = (num) =>
{
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return num.toString().replace(regexp, ',');
}