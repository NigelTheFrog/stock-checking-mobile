import { View, Text, Alert, TouchableOpacity, TextInput } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import Modal from "react-native-modal";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { styles } from '../../../../assets/styles/style';
import AvoidingWrapper from '../../../../assets/styles/avoidingWrapper';
import { CredentialContext, BaseURL, AppVersion } from '../../../../Credentials';
import request from '../../../../request';
import Dropdownitem from '../../../component/dropdownitem';
import ProcessController from '../../../../controller/ProcessController';
import Calculator from '../../../component/calculator';
import Input from '../../../component/input';
import Multiselectitem from '../../../component/multiselectitem';

export default function AddTemuanItem({ route, navigation }) {
  const { storedCredentials, setStoredCredentials } = useContext(CredentialContext);
  const { trsid, csoid } = route.params;
  const [lokasiData, setLokasiData] = useState([]);
  const [warnaData, setWarnaData] = useState([]);
  const [gradeData, setGradeData] = useState([]);
  const [item, onChangeItem] = useState('');
  const [itemId, setItemId] = useState('');
  const [lokasi, setLokasi] = useState(null);
  const [warna, setWarna] = useState([]);
  const [grade, setGrade] = useState('');
  const [keterangan, onChangeKeterangan] = useState('');
  const [history, setHistory] = useState('');
  const [displayInput, setDisplayInput] = useState('');
  const [tempInput, setTempInput] = useState('');
  const [boxQty, setBoxQty] = useState('');
  const [isianBox, setIsianBox] = useState('');
  const [hasilPerkalian, setHasilPerkalian] = useState('');
  const [input, setInput] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [csoDetId, setCsoDetId] = useState('');
  const [csoDet2Id, setCsoDet2Id] = useState('');
  const [resultCalc, setResultCalc] = useState('');

  const handleTextQtyChange = (text) => {
    setDisplayInput(text);
    setHistory(text);
    setTempInput(text);
    setResultCalc(text);
  }

  function showCalculator() {
    if (csoDetId == "" && csoDet2Id == "") {
      request.post('tambah-perhitungan-temuan', {
        type: 1,
        username: storedCredentials[0],
        csoid: csoid,
        trsid: trsid,
        temuanname: item,
        lokasi: lokasi,
        color: warna,
        statusItem: "TR",
        grade: grade
      }).then((responseData) => {
        if (responseData['result'] == 1) {
          setCsoDetId(responseData['csodetid']);
          setCsoDet2Id(responseData['csodet2id']);
          setItemId(responseData['itemid'])
          setModalVisible(!isModalVisible);
        } else {
          Alert.alert('Proses Gagal', 'Harap periksa koneksi internet anda dan tekan tombol "Hitung" ulang', [
            { text: 'OK' },
          ]);
        };
      })
    } else {
      setModalVisible(!isModalVisible)
    }
  }

  function submit() {
    request.post('add-temuan-item', {
      temuanname: item,
      lokasi: lokasi,
      qtycso: Number(resultCalc),
      color: warna,
      remark: keterangan,
      username: storedCredentials[0],
      trsid: trsid,
      csoid: csoid,
      csodetid: csoDetId,
      csodet2id: csoDet2Id,
      itemid: itemId,
      statusItem: "TR",
      grade: grade
    })
      .then((responseData) => {
        if (responseData['result'] == 1) {
          navigation.navigate("HomeItem");
        } else {
          Alert.alert('Proses Gagal', 'Harap periksa koneksi internet anda dan lakukan penyimpanan ulang', [
            { text: 'OK' },
          ]);
        }
      });
  }
  useEffect(() => {
    ProcessController.setData('location-list', "locationid", "locationname", setLokasiData, 2, setLokasi);
    ProcessController.setData('color-list', "colorid", "colordesc", setWarnaData, 0, setWarna);
    ProcessController.setData('grade-list?statusitem=TR', "gradecode", "description", setGradeData, 0, setGrade);
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

        <Input
          groupStyle={styles.formGroup}
          labelStyle={styles.formGroupLabel}
          label='Item'
          placeHolder={'Nama Item'}
          placeHolderStyle={styles.formGroupPlaceHolderStyle}
          textInputStyle={styles.formGroupNamaItem}
          setter={onChangeItem}
          value={item}
          multiline={true}
        />

        <Dropdownitem
          groupStyle={styles.formGroup}
          labelStyle={styles.formGroupLabel}
          label='Area'
          dropdownStyle={styles.formGroupInput}
          data={lokasiData}
          placeHolder="--Pilih Area--"
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
              onButtonPressed={() => {
                if (item == null)
                  Alert.alert('Proses Gagal', 'Anda belum memilih item', [
                    { text: 'OK' },
                  ]);
                else if (lokasi == null)
                  Alert.alert('Proses Gagal', 'Anda belum memilih lokasi', [
                    { text: 'OK' },
                  ]);
                else if (warna.length === 0)
                  Alert.alert('Proses Gagal', 'Anda belum memilih warna', [
                    { text: 'OK' },
                  ]);
                else showCalculator();
              }}
              additionalComponent={<Text style={styles.buttonAccountText}>Hitung</Text>}
            />
          }
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
          groupStyle={styles.formGroup}
          labelStyle={styles.formGroupLabel}
          label='Ket.'
          textInputStyle={styles.formKeterangan}
          value={keterangan}
          setter={onChangeKeterangan}
          multiline={true}
        />
        <ProcessButton
          buttonStyle={styles.buttonSubmit}
          onButtonPressed={
            () => {

              if (item == null)
                Alert.alert('Tambah Item Gagal', 'Anda belum memilih item', [
                  { text: 'OK' },
                ]);
              else if (lokasi == null)
                Alert.alert('Tambah Item Gagal', 'Anda belum memilih lokasi', [
                  { text: 'OK' },
                ]);
              else if (warna == [])
                Alert.alert('Tambah Item Gagal', 'Anda belum memilih warna', [
                  { text: 'OK' },
                ]);
              else if (keterangan == '')
                Alert.alert('Peringatan', 'Apakah anda hendak menambahkan item tanpa memberikan keterangan?', [
                  { text: 'Iya', onPress: () => submit() }, { text: 'Batal' }
                ]);
              else submit();
            }
          }
          additionalComponent={<Text style={styles.buttonAccountText}><Ionicons name="save-sharp" size={20} color="white" />   Simpan</Text>}
        />

        <ProcessButton
          buttonStyle={styles.buttonDelete}
          additionalComponent={<Text style={styles.buttonAccountText}><Ionicons name="trash" size={20} color="white" />   Hapus</Text>}
        />

        <Text style={styles.appVersionLabel}>Version {AppVersion}</Text>
      </View>

    </AvoidingWrapper>
  )
}