import { Alert, Platform, Text, View } from "react-native";
import request from "../request";
import RNFS from 'react-native-fs';
import { Colors, styles } from "../assets/styles/style";

class ApprovalController {

    async saveDataAsPdf(fileName, content) {
        try {
            const path = RNFS.DownloadDirectoryPath;
            const destinationPath = `${path}/${fileName}`;
            await RNFS.writeFile(destinationPath, content, 'base64');
            Alert.alert('Success', `PDF saved at: ${destinationPath}`);
        } catch (e) {
            console.log(e);
        }

    }

    displayDocument(level, typecekstok, setter, setPic) {
        request.post('daftar-dokumen-csoitem', { typecekstok: typecekstok, level: level }).then((responseData) => {
            setter(responseData['data']);
            setPic(responseData['picApproval']);
        });
    }

    aprroveCsoItem(trsid, approvalField, approvedBy, navigation) {
        request.post('approve-csoitem', { trsid: trsid, level: approvalField, approvedBy: approvedBy })
            .then((responseData) => {
                if (responseData['status'] == 1) {
                    Alert.alert('Success', responseData['message']);
                    navigation.navigate("HomeApproval");
                }
            });
    }

    resumeCsoItem(
        trsid,
        csoType,
        setPelaku,
        setAnalisator,
        setRekapitulasi,
        setSelisihKesalahanAdmin,
        setSelisihTertukar,
        setSelisihPlusMinus,
        setSelisihItemTidakHitung,
        setHistoryTigaBulan,
        setCoy,
        setDataCso,
        setIsWaiting
    ) {
        request.post('dokumen-resume-csoitem', { trsidresume: trsid, pdf: 0 }).then((responseData) => {
            try {
                const data = responseData['data'];
                let pelaku = [];
                let analisator = [];
                let pelakuIteration = 1;
                let analisatorIteration = 1;
                let dataHistoryCso = [];

                for (let i in data.dataPelaku) {
                    pelaku.push([pelakuIteration, data.dataPelaku[i].name, data.dataPelaku[i].departemen, data.dataPelaku[i].note]);
                    pelakuIteration++;
                }
                for (let i in data.dataAnalisator) {
                    analisator.push([analisatorIteration, data.dataAnalisator[i].name, data.dataAnalisator[i].departemen, data.dataAnalisator[i].note]);
                    analisatorIteration++;
                }

                data.data3BulanTerakhir.forEach(data => {
                    const percentage = (data.item_ok / data.item_ada) * 100;
                    const roundedPercentage = Math.round(percentage * 100) / 100;
                    const month = data.monthstart == '01' ? 'Januari' :
                        data.monthstart == '02' ? 'Februari' :
                            data.monthstart == '03' ? 'Maret' :
                                data.monthstart == '04' ? 'April' :
                                    data.monthstart == '05' ? 'Mei' :
                                        data.monthstart == '06' ? 'Juni' :
                                            data.monthstart == '07' ? 'Juli' :
                                                data.monthstart == '08' ? 'Agustus' :
                                                    data.monthstart == '09' ? 'September' :
                                                        data.monthstart == '10' ? 'Oktober' :
                                                            data.monthstart == '11' ? 'November' :
                                                                'Desember'
                    dataHistoryCso.push([month, data.csomaterial, data.item_ada, data.item_ok, `${roundedPercentage}%`]);
                });
                let dataRekapitulasiHasil = [];
                data.dataRekapitulasi.forEach((element) => {
                    dataRekapitulasiHasil.push(csoType == 'CSS' ? {
                        title: `Tanggal Import: ${element.tanggal_import}`,
                        content: 
                        <View style={{marginTop: 5, borderTopWidth: 0.5}}>
                            <Text style={styles.accordiodNestedRow.contentText}>Total item: <Text style={{fontWeight:'bold'}}>{element.total_item}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Item Ada: <Text style={{fontWeight:'bold'}}>{element.item_ada}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Item Ok: <Text style={{fontWeight:'bold'}}>{element.item_ok}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Item Selisih: <Text style={{fontWeight:'bold'}}>{element.item_selisih}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>% Keakuratan Stok: <Text style={{fontWeight:'bold'}}>{Math.round(((element.item_ok / element.total_item) * 100 + Number.EPSILON) * 100) / 100}%</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Item Selisih Plus: <Text style={{fontWeight:'bold'}}>{element.item_selisih_plus}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Item Selisih Minus: <Text style={{fontWeight:'bold'}}>{element.item_selisih_minus}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Item Beda Batch: <Text style={{fontWeight:'bold'}}>{element.beda_batch}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Item Tertukar: <Text style={{fontWeight:'bold'}}>{element.tertukar}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>% Selisih: <Text style={{fontWeight:'bold'}}>{Math.round(((element.item_selisih / element.total_item) * 100 + Number.EPSILON) * 100) / 100}%</Text></Text>
                        </View>
                    } : element);
                });

                let dataItemKesalahanAdmin = [];
                let dataItemTertukar = [];
                let dataItemSelisihPlusMinus = [];
                let dataItemTidakHitung = [];

                data.dataItemKesalahanAdmin.forEach((element) => {
                    const barangSelisih = element.hasilcso - (element.onhand - element.koreksi - element.deviasi);
                    const hpp = element.hpp_manual == "0.00" ? element.hpp : element.hpp_manual;
                    const nominalSelisih = barangSelisih * hpp;
                    dataItemKesalahanAdmin.push({
                        title: element.itemname,
                        content: 
                        <View style={{marginTop: 5, borderTopWidth: 0.5}}>
                            <Text style={styles.accordiodNestedRow.contentText}>Keputusan: <Text style={{fontWeight:'bold'}}>{element.keputusandesc}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>SLS LBR: <Text style={{fontWeight:'bold'}}>{(element.onhand - element.koreksi - element.deviasi)}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Realita LBR: <Text style={{fontWeight:'bold'}}>{element.hasilcso}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Barang Selisih Plus: <Text style={{fontWeight:'bold'}}>{element.hasilcso > (element.onhand - element.koreksi - element.deviasi) ? barangSelisih : ""}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Barang Selisih Minus: <Text style={{fontWeight:'bold', color: Colors.red}}>{element.hasilcso < (element.onhand - element.koreksi - element.deviasi) ? barangSelisih : ""}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>HPP: <Text style={{fontWeight:'bold'}}>Rp. {Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(hpp)}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Nominal Selisih Plus: <Text style={{fontWeight:'bold'}}>{element.hasilcso > (element.onhand - element.koreksi - element.deviasi) ? `Rp. ${Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(nominalSelisih)}` : ""}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Nominal Selisih Minus: <Text style={{fontWeight:'bold',color: Colors.red}}>{element.hasilcso < (element.onhand - element.koreksi - element.deviasi) ? `Rp. ${Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(nominalSelisih)}` : ""}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Nominal Pembebanan: <Text style={{fontWeight:'bold',color: Colors.red}}>Rp. {Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(element.pembebanan)}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>No Adjust: <Text style={{fontWeight:'bold'}}>{element.nodoc}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Keterangan: <Text style={{fontWeight:'bold'}}>{element.keterangan}</Text></Text>
                        </View>
                    });
                });

                data.dataItemTertukar.forEach((element) => {
                    const barangSelisih = element.hasilcso - (element.onhand - element.koreksi - element.deviasi);
                    const hpp = element.hpp_manual == "0.00" ? element.hpp : element.hpp_manual;
                    const nominalSelisih = barangSelisih * hpp;
                    dataItemTertukar.push({
                        title: element.itemname,
                        content: 
                        <View style={{marginTop: 5, borderTopWidth: 0.5}}>
                            <Text style={styles.accordiodNestedRow.contentText}>Keputusan: <Text style={{fontWeight:'bold'}}>{element.keputusandesc}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>SLS LBR: <Text style={{fontWeight:'bold'}}>{(element.onhand - element.koreksi - element.deviasi)}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Realita LBR: <Text style={{fontWeight:'bold'}}>{element.hasilcso}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Barang Selisih Plus: <Text style={{fontWeight:'bold'}}>{element.hasilcso > (element.onhand - element.koreksi - element.deviasi) ? barangSelisih : ""}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Barang Selisih Minus: <Text style={{fontWeight:'bold', color: Colors.red}}>{element.hasilcso < (element.onhand - element.koreksi - element.deviasi) ? barangSelisih : ""}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>HPP: <Text style={{fontWeight:'bold'}}>Rp. {Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(hpp)}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Nominal Selisih Plus: <Text style={{fontWeight:'bold'}}>{element.hasilcso > (element.onhand - element.koreksi - element.deviasi) ? `Rp. ${Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(nominalSelisih)}` : ""}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Nominal Selisih Minus: <Text style={{fontWeight:'bold',color: Colors.red}}>{element.hasilcso < (element.onhand - element.koreksi - element.deviasi) ? `Rp. ${Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(nominalSelisih)}` : ""}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Nominal Pembebanan: <Text style={{fontWeight:'bold',color: Colors.red}}>Rp. {Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(element.pembebanan)}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>No Adjust: <Text style={{fontWeight:'bold'}}>{element.nodoc}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Keterangan: <Text style={{fontWeight:'bold'}}>{element.keterangan}</Text></Text>
                        </View>
                    });
                });

                data.dataItemSelisih.forEach((element) => {
                    const barangSelisih = element.hasilcso - (element.onhand - element.koreksi - element.deviasi);
                    const hpp = element.hpp_manual == "0.00" ? element.hpp : element.hpp_manual;
                    const nominalSelisih = barangSelisih * hpp;
                    dataItemSelisihPlusMinus.push({
                        title: element.itemname,
                        content: 
                        <View style={{marginTop: 5, borderTopWidth: 0.5}}>
                            <Text style={styles.accordiodNestedRow.contentText}>Keputusan: <Text style={{fontWeight:'bold'}}>{element.keputusandesc}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>SLS LBR: <Text style={{fontWeight:'bold'}}>{(element.onhand - element.koreksi - element.deviasi)}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Realita LBR: <Text style={{fontWeight:'bold'}}>{element.hasilcso}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Barang Selisih Plus: <Text style={{fontWeight:'bold'}}>{element.hasilcso > (element.onhand - element.koreksi - element.deviasi) ? barangSelisih : ""}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Barang Selisih Minus: <Text style={{fontWeight:'bold', color: Colors.red}}>{element.hasilcso < (element.onhand - element.koreksi - element.deviasi) ? barangSelisih : ""}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>HPP: <Text style={{fontWeight:'bold'}}>Rp. {Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(hpp)}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Nominal Selisih Plus: <Text style={{fontWeight:'bold'}}>{element.hasilcso > (element.onhand - element.koreksi - element.deviasi) ? `Rp. ${Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(nominalSelisih)}` : ""}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Nominal Selisih Minus: <Text style={{fontWeight:'bold',color: Colors.red}}>{element.hasilcso < (element.onhand - element.koreksi - element.deviasi) ? `Rp. ${Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(nominalSelisih)}` : ""}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Nominal Pembebanan: <Text style={{fontWeight:'bold',color: Colors.red}}>Rp. {Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(element.pembebanan)}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>No Adjust: <Text style={{fontWeight:'bold'}}>{element.nodoc}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Keterangan: <Text style={{fontWeight:'bold'}}>{element.keterangan}</Text></Text>
                        </View>
                    });
                });
                data.dataItemTidakHitung.forEach((element) => {
                    const barangSelisih = element.hasilcso - (element.onhand - element.koreksi - element.deviasi);
                    const hpp = element.hpp_manual == "0.00" ? element.hpp : element.hpp_manual;
                    const nominalSelisih = barangSelisih * hpp;
                    dataItemTidakHitung.push({
                        title: element.itemname,
                        content: 
                        <View style={{marginTop: 5, borderTopWidth: 0.5}}>
                            <Text style={styles.accordiodNestedRow.contentText}>Keputusan: <Text style={{fontWeight:'bold'}}>{element.keputusandesc}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>SLS LBR: <Text style={{fontWeight:'bold'}}>{(element.onhand - element.koreksi - element.deviasi)}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Realita LBR: <Text style={{fontWeight:'bold'}}>{element.hasilcso}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Barang Selisih Plus: <Text style={{fontWeight:'bold'}}>{element.hasilcso > (element.onhand - element.koreksi - element.deviasi) ? barangSelisih : ""}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Barang Selisih Minus: <Text style={{fontWeight:'bold', color: Colors.red}}>{element.hasilcso < (element.onhand - element.koreksi - element.deviasi) ? barangSelisih : ""}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>HPP: <Text style={{fontWeight:'bold'}}>Rp. {Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(hpp)}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Nominal Selisih Plus: <Text style={{fontWeight:'bold'}}>{element.hasilcso > (element.onhand - element.koreksi - element.deviasi) ? `Rp. ${Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(nominalSelisih)}` : ""}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Nominal Selisih Minus: <Text style={{fontWeight:'bold',color: Colors.red}}>{element.hasilcso < (element.onhand - element.koreksi - element.deviasi) ? `Rp. ${Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(nominalSelisih)}` : ""}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Nominal Pembebanan: <Text style={{fontWeight:'bold',color: Colors.red}}>Rp. {Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(element.pembebanan)}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>No Adjust: <Text style={{fontWeight:'bold'}}>{element.nodoc}</Text></Text>
                            <Text style={styles.accordiodNestedRow.contentText}>Keterangan: <Text style={{fontWeight:'bold'}}>{element.keterangan}</Text></Text>
                        </View>
                    });
                });

                setPelaku(pelaku);
                setAnalisator(analisator);
                setHistoryTigaBulan(dataHistoryCso);
                setRekapitulasi(csoType == 'CSS' ? dataRekapitulasiHasil : dataRekapitulasiHasil[0]);
                setSelisihKesalahanAdmin(dataItemKesalahanAdmin);
                setSelisihTertukar(dataItemTertukar);
                setSelisihPlusMinus(dataItemSelisihPlusMinus);
                setSelisihItemTidakHitung(dataItemTidakHitung);
                setCoy(data.dataCoy);
                setDataCso(data.dataCso);
                setIsWaiting(false);
            } catch (e) {
                console.log(e);
            }

        });
    }


    downloadResumeItem(trsid) {
        request.post('dokumen-resume-csoitem', { trsidresume: trsid, pdf: 1 }).then((responseData) => {
            this.saveDataAsPdf(responseData.data.filename, responseData.data.content);
        });
    }

    downloadLaporanItem(trsid) {
        request.post('dokumen-laporan-csoitem', { trsidlaporan: trsid, pdf: 1 }).then((responseData) => {
            this.saveDataAsPdf(responseData.data.filename, responseData.data.content);
        });
    }
}

export default new ApprovalController();