import { View, Text } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors, styles } from '../../../../assets/styles/style';
import AvoidingWrapper from '../../../../assets/styles/avoidingWrapper';
import { CredentialContext } from '../../../../Credentials';
import ProcessController from '../../../../controller/ProcessController';
import Dropdownitem from '../../../component/dropdownitem';
import Multiselectitem from '../../../component/multiselectitem';
import Input from '../../../component/input';
import Calculator from '../../../component/calculator';
import ProcessButton from '../../../component/processButton';

export default function AddAvalan({ route, navigation }) {
  const { storedCredentials, setStoredCredentials } = useContext(CredentialContext);
  const { trsid, csoid } = route.params;
  const [gradeData, setGradeData] = useState([]);
  const [avalanData, setAvalanData] = useState([]);
  const [lokasiData, setLokasiData] = useState([]);
  const [warnaData, setWarnaData] = useState([]);
  const [avalan, setAvalan] = useState(null);
  const [avalanBatchId, setAvalanBatchId] = useState(null);
  const [trsdetid, setTrsDetId] = useState(null);
  const [lokasi, setLokasi] = useState(null);
  const [warna, setWarna] = useState([]);
  const [dimension, setDimension] = useState('');
  const [tolerance, setTolerance] = useState('');
  const [keterangan, onChangeKeterangan] = useState('');
  const [grade, setGrade] = useState('');
  const [history, setHistory] = useState('');
  const [displayInput, setDisplayInput] = useState('');
  const [boxQty, setBoxQty] = useState('');
  const [isianBox, setIsianBox] = useState('');
  const [hasilPerkalian, setHasilPerkalian] = useState('');
  const [tempInput, setTempInput] = useState('');
  const [input, setInput] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [csoDetId, setCsoDetId] = useState('');
  const [csoDet2Id, setCsoDet2Id] = useState('');
  const [resultCalc, setResultCalc] = useState('');
  const [tonaseQty, setTonaseQty] = useState(null);

  useEffect(() => {
    ProcessController.setData(`avalan-list?trsid=${trsid}`, "itemid", "itemname", setAvalanData, 1, setAvalanBatchId);
    ProcessController.setData('location-list', "locationid", "locationname", setLokasiData, 2, setLokasi);
    ProcessController.setData('color-list', "colorid", "colordesc", setWarnaData, 0, setWarna);
  }, []);

  return (
    <AvoidingWrapper>
      <View style={styles.styledContainer}>
        <Calculator
          isVisible={isModalVisible}
          closeModal={setModalVisible}
          modalStyle={styles.modalView}
          input={input}
          setInput={setInput}
          history={history}
          setHistory={setHistory}
          displayInput={displayInput}
          setDisplayInput={setDisplayInput}
          resultCalculation={resultCalc}
          setResultCalculation={setResultCalc}
          temporaryInput={tempInput}
          setTemporaryInput={setTempInput}
          boxQty={boxQty}
          setBoxQty={setBoxQty}
          isianBox={isianBox}
          setIsianBox={setIsianBox}
          hasilPerkalian={hasilPerkalian}
          setHasilPerkalian={setHasilPerkalian}
          setter={() => ProcessController.submitPerhitungan(
            csoDet2Id, tempInput, history, input,
            [setInput, setResultCalc, setHistory, setDisplayInput, setTempInput, setHasilPerkalian],
            [boxQty, isianBox, hasilPerkalian]
          )}
        />

        <Dropdownitem
          groupStyle={styles.formGroup}
          labelStyle={styles.formGroupLabel}
          label='Avalan'
          dropdownStyle={styles.formGroupInput}
          data={avalanData}
          placeHolder="--Pilih Avalan--"
          placeHolderStyle={styles.formGroupPlaceHolderStyle}
          setFocus={setIsFocus}
          searchPlaceholder='Cari...'
          value={avalanBatchId}
          valueField="id"
          isNotAvalan={false}
          setter={item => {
            setAvalan(item.value);
            setAvalanBatchId(item.id);
            setTrsDetId(item.trsdetid);
            setDimension(item.dimension);
            setTolerance(item.tolerance);
            setIsFocus(false);
            ProcessController.setData(`grade-list?trsdetid=${item['trsdetid']}&statusitem=${item['statusitem']}`, "gradecode", "description", setGradeData, 0, setGrade);
          }}
        />

        <Input
          groupStyle={styles.formGroup}
          labelStyle={styles.formGroupLabel}
          label='Dimensi'
          placeHolder='Dimensi Item Batch'
          placeHolderStyle={styles.formGroupPlaceHolderStyle}
          textInputStyle={[styles.formKeterangan,{color: Colors.brand}]}
          value={dimension}
          multiline={true}
          statusEditable={false}          
        />

        <Input
          groupStyle={styles.formGroup}
          labelStyle={styles.formGroupLabel}
          label='Toleransi'
          placeHolder='Toleransi Item Batch'
          placeHolderStyle={styles.formGroupPlaceHolderStyle}
          textInputStyle={[styles.formGroupNamaItem,{color: Colors.brand}]}
          value={tolerance}   
          statusEditable={false}            
        />

        <Dropdownitem
          groupStyle={styles.formGroup}
          labelStyle={styles.formGroupLabel}
          label='Lokasi'
          dropdownStyle={styles.formGroupInput}
          data={lokasiData}
          placeHolder="--Pilih Lokasi--"
          placeHolderStyle={styles.formGroupPlaceHolderStyle}
          setFocus={setIsFocus}
          valueField="value"
          value={lokasi}
          setter={lokasi => {
            setLokasi(lokasi.value);
            setIsFocus(false);
          }}
        />

        <Multiselectitem
          groupStyle={styles.formGroupColor}
          labelStyle={styles.formGroupColorLabel}
          label='Kode Cat'
          dropdownStyle={styles.formGroupColorMultiSelect}
          data={warnaData}
          placeHolder='--Pilih Warna--'
          placeHolderStyle={styles.formGroupPlaceHolderStyle}
          value={warna}
          setter={item => {
            setWarna(item);
          }}
        />

        <Dropdownitem
          groupStyle={styles.formGroup}
          labelStyle={styles.formGroupLabel}
          label='Gudang'
          dropdownStyle={styles.formGroupInput}
          data={gradeData}
          placeHolder="--Pilih Gudang--"
          placeHolderStyle={styles.formGroupPlaceHolderStyle}
          setFocus={setIsFocus}
          valueField="value"
          value={grade}
          searchable={false}
          setter={grade => {
            setGrade(grade.value);
            setIsFocus(false);
          }}
        />

        <Input
          groupStyle={styles.formPerhitungan}
          labelStyle={styles.formPerhitunganLabel}
          label="Qty."
          textInputStyle={styles.formPerhitunganInput}
          value={resultCalc}
          statusEditable={input.length == 0 ? true : false}
          setter={(text) => {
            setDisplayInput(text);
            setHistory(text);
            setTempInput(text);
            setResultCalc(text);
          }}
          keyboardType='numeric'
          placeHolder='Jumlah Item'
          placeHolderStyle={styles.formGroupColorPlaceHorlder}
          additionalItem={
            <ProcessButton
              buttonStyle={styles.formPerhitunganButton}
              onButtonPressed={() => ProcessController.showCalculator(
                [csoDetId, csoDet2Id],
                [storedCredentials[0], csoid],
                [avalan, avalanBatchId, lokasi, warna, 'A', grade, trsdetid],
                [setCsoDetId, setCsoDet2Id, setModalVisible],
                isModalVisible
              )}
              additionalComponent={<Text style={styles.buttonAccountText}>Hitung</Text>}
            />
          }
        />

        {
          storedCredentials[11] == 'KKS' ?
            <Input
              groupStyle={styles.formGroup}
              labelStyle={styles.formGroupLabel}
              label='Tonase'
              textInputStyle={styles.formGroupNamaItem}
              value={tonaseQty}
              setter={setTonaseQty}
            /> : null
        }

        <Input
          groupStyle={styles.formGroup}
          labelStyle={styles.formGroupLabel}
          label='Ket.'
          placeHolder='Keterangan / Remark'
          placeHolderStyle={styles.formGroupPlaceHolderStyle}
          textInputStyle={styles.formKeterangan}
          value={keterangan}
          setter={onChangeKeterangan}
          multiline={true}
        />

        <ProcessButton
          buttonStyle={styles.buttonSubmit}
          onButtonPressed={
            () => ProcessController.addItem(
              [csoDetId, csoDet2Id],
              [storedCredentials[0], csoid],
              [avalan, avalanBatchId, lokasi, resultCalc, warna, keterangan, grade, trsdetid, tonaseQty],
              'A',
              navigation
            )
          }
          additionalComponent={<Text style={styles.buttonAccountText}><Ionicons name="save-sharp" size={20} color="white" />   Simpan</Text>}
        />
        <ProcessButton
          buttonStyle={styles.buttonDelete}
          additionalComponent={<Text style={styles.buttonAccountText}><Ionicons name="trash" size={20} color="white" />   Hapus</Text>}
        />
      </View>
    </AvoidingWrapper>
  )
}