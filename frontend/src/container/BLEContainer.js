import React, { useEffect }  from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import { 
    setSkipping, 
    setSkippingConnection, 
    setConnectedDeviceAddr,
    setSkippingBattery,
    setSkippingDeviceList,
} from '@redux/Skipping';

import {ICBleManager} from '@/ble/ICBleManager';

import Toast from 'react-native-toast-message';

if (!global.bleManager) {
    global.bleManager = new ICBleManager();
}

const bleManager = global.bleManager;


bleManager.setDelegate({
  onInitFinish: (bInitRet) => {
      console.log("init ret =" + bInitRet);
  },
});
  
bleManager.initMgr();

const BLEContainer = () => 
{
    const dispath = useDispatch();

    const {connection, connectedMacAddr, deviceList} = useSelector(({skipping}) => ({
      connection: skipping.connection,
      connectedMacAddr: skipping.connectedMacAddr,
      deviceList: skipping.deviceList
    }));
  
    useEffect(()=>{
      if(connectedMacAddr === '')
      {
        dispath(setSkippingConnection('connecting'));
        
        bleManager.setDelegate({
          onInitFinish: (bInitRet) => {
              console.log("init ret =" + bInitRet);
          },
        });
          
        bleManager.initMgr();

        bleManager.startScan((device) => {
          dispath(setSkippingDeviceList({
            macAddr: device.macAddr,
            name: device.name
          }));
        });
      }
      else
      {
        if(connection === 'connecting')
        {
          bleManager.setDelegate({
            onInitFinish: (bInitRet) => {
              console.log("init ret =" + bInitRet);
            },

            onReceiveSkipBattery: (macAddr, data) => {
              dispath(setSkippingBattery(data));
            },

            onReceiveSkipData: (macAddr, data) => {
              if(data)
              {
                dispath(setSkipping(data));
              }
            }
          });

          bleManager.addDevice(connectedMacAddr, ()=>{
            dispath(setSkippingConnection('connect'));
            bleManager.stopScan();
          });
        }
      }
    },[connectedMacAddr]);

    useEffect(()=>{
      if(connection === 'disconnect')
      {
        if(connectedMacAddr)
        {
          // 삭제 후 초기화
          bleManager.removeDevice(connectedMacAddr,()=>{
            dispath(setConnectedDeviceAddr(''));
          });
        }
      }
    },[connection]);

    useEffect(()=>{
      if(Platform.OS === 'android')
      {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(granted=>{
          Toast.show({
            type: 'success',
            text1: '권한 알림',
            text2: '위치 권한이 허락 되었습니다 ✅'
          });
        }).catch(error=>{
          Toast.show({
            type: 'error',
            text1: '⚠ 권한 알림',
            text2: '위치 권한이 수락되지 않았습니다. 앱 종료 후 다시 권한을 확인해주세요 !!'
        });
        });
      }
    },[]);
    return <></>;
};

export default BLEContainer;