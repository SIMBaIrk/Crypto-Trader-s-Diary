import React, { Fragment, useState } from 'react';

export const TradesClosed = () => {
    return (
        <div className="panel panel-default">
        <div className="panel-heading">Завершенные сделки</div>
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Инструмент</th>
                        <th>Дата</th>
                        <th>П/У</th>
                        <th>П/У %</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="success">
                        <th scope="row">1</th>
                        <td>BTCUSDT</td>
                        <td>01010122</td>
                        <td>01010122</td>
                        <td>01010122</td>
                    </tr>
                    <tr className="danger">
                        <th scope="row">2</th>
                        <td>BTCUSDT</td>
                        <td>01010122</td>
                        <td>01010122</td>
                        <td>01010122</td>
                    </tr>
                </tbody>
            </table>
    </div>
    )
}

export const TradesOpen = () => {
    return(
    <div className="panel panel-default">
    <div className="panel-heading">Открытые сделки</div>
        <table className="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Инструмент</th>
                    <th>Дата</th>
                    <th>П/У</th>
                    <th>П/У %</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>BTCUSDT</td>
                    <td>01010122</td>
                    <td>01010122</td>
                    <td>01010122</td>
                </tr>
               </tbody>
        </table>
  </div>)
}

// пока через кнопку обновления
const RefreshButton = (props) => {
    const [refreshing, changeRefreshing] = useState(false);
    function handleClick(){
        changeRefreshing(true);

        Meteor.call('ccxt.fetchMyTrades',(error, result)=>{
            console.log(error);
            console.log(result);
            changeRefreshing(false);
        });
    }

    let buttonClass = "btn default";
    if (refreshing){
        buttonClass += " disabled";
    }

    return <button className={buttonClass} onClick={handleClick}><span className="glyphicon glyphicon-refresh" aria-hidden="true"></span> Подгрузить</button>
}

// страница статистики
export const TradeBody = (props) => {
    return(<Fragment>
        {props.user ? (<RefreshButton user={props.user}/>):(
        <div>
            <p>Ниже пример как будут выглядеть статистика.</p>
            <p>просто сделай ещё один хороший трейд</p>
            <TradesOpen />
            <TradesClosed />
        </div>
        )
        }
        </Fragment>
    );
}