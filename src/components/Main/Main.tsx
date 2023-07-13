import React from 'react';
import styles from './Main.module.scss'
import data from '../../restaurantData.json'
import {IDay} from "../../types/types";
import {AiOutlineClockCircle} from "react-icons/ai";

const Main = () => {
    let day = new Date().getDay()

    const dayState = (state: number) => {
        return state < 43200 ? `${state / 3600} AM` : state / 3600 > 12 ? `${state / 3600 - 12} PM` : `${state / 3600} PM`
    }
    const getOpenTime = (el: IDay[]) => {
        let arr = el.filter(elem => elem.type === 'open')
        return dayState(arr[0].value)
    }

    const getCloseTime = (el: IDay[], idx: number) => {
        let arr = el.filter(elem => elem.type === 'close')
        return arr.length ? dayState(arr[arr.length - 1].value) : dayState(Object.values(data)[idx + 1][0].value)
    }

    const getSeveralOpenings = (el: IDay[], idx: number) => {
        let openArr = el.filter(elem => elem.type === 'open')
        let closeArr = el.filter(elem => elem.type === 'close')
        let ansArr = []
        if (openArr > closeArr) {
            for (let i = 0; i <= closeArr.length; i++) {
                i === closeArr.length
                    ? ansArr.push([dayState(openArr[openArr.length - 1].value), idx + 1 > 6
                        ? dayState(Object.values(data)[0][0].value) : dayState(Object.values(data)[idx + 1][0].value)])
                    : ansArr.push([dayState(openArr[i].value), dayState(closeArr[i].value)])
            }
        } else if (closeArr > openArr) {
            for (let i = 0; i < openArr.length; i++) {
                ansArr.push([dayState(openArr[i].value), dayState(closeArr[i + 1].value)])
            }
        } else {
            if (el[0].type === 'open') {
                for (let i = 0; i < openArr.length; i++) {
                    ansArr.push([dayState(openArr[i].value), dayState(closeArr[i].value)])
                }
            } else {
                for (let i = 0; i < openArr.length; i++) {
                    i === closeArr.length - 1
                        ? ansArr.push([dayState(openArr[openArr.length - 1].value), idx + 1 > 6
                            ? dayState(Object.values(data)[0][0].value) : dayState(Object.values(data)[idx + 1][0].value)])
                        : ansArr.push([dayState(openArr[i].value), dayState(closeArr[i + 1].value)])
                }
            }

        }
        return ansArr.map((el, idx) => idx < ansArr.length - 1 ? `${el[0]} - ${el[1]}, ` : `${el[0]} - ${el[1]}`)

    }

    function capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <div className={styles.main}>
            <div className={styles.scheduleWrapper}>
                <div className={styles.scheduleWrapper__title}>
                    <AiOutlineClockCircle className={styles.clockImg}/>
                    <span>Opening hours</span>
                </div>
                <div className={styles.schedule}>
                    {Object.keys(data).map((el, idx) => <div key={idx} className={styles.schedule__day}>
                            {idx + 1 === day
                                ? <div>
                                    <span className={styles.weekDayFont}>{capitalize(el)}</span>
                                    <span className={styles.currentDay}>TODAY</span>
                                </div> : <span className={styles.weekDayFont}>{capitalize(el)}</span>}
                            {Object.values(data)[idx].length
                                ?
                                Object.values(data)[idx].length > 3 ? getSeveralOpenings(Object.values(data)[idx] as IDay[], idx) :
                                    <div>{`${getOpenTime(Object.values(data)[idx] as IDay[])} - ${getCloseTime(Object.values(data)[idx] as IDay[], idx)}`}</div>
                                : <span className={styles.closedDaysFont}>Closed</span>}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Main;