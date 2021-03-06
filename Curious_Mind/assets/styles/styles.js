import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  defaultBackground: {
    backgroundColor: '#f7f2f1',
  },
  defaultButtonColor: {
    backgroundColor: '#3c4498',
  },
  whiteBackground: {
    backgroundColor: 'white',
  },
  redBackground: {
    backgroundColor: 'red',
    borderColor: 'red',
  },
  blueText: {
    color: 'blue',
  },
  flex1: {
    flex: 1,
  },
  flex4: {
    flex: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f2f1',
  },
  safeAreaStyle: {
    flex: 1,
    backgroundColor: '#f7f2f1',
  },
  aligItemsCenter: {
    alignItems: 'center',
  },
  aligItemsStart: {
    alignItems: 'flex-start',
  },
  alignSelfStart: {
    alignSelf: 'flex-start',
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  textCenter: {
    textAlign: 'center',
  },
  marginTop35: {
    marginTop: 35,
  },
  marginTop15: {
    marginTop: 15,
  },
  marginTop10: {
    marginTop: 10,
  },
  marginTop25: {
    marginTop: 25,
  },
  backButton: {
    backgroundColor: '#f7f2f1',
    paddingLeft: 10,
  },
  backButtonContainer: {
    alignSelf: 'flex-start',
    paddingLeft: 10,
    backgroundColor: '#f7f2f1',
  },
  logo: {
    marginTop: 40,
  },
  paddHorizontal15: {
    paddingHorizontal: 15,
  },
  paddHorizontal20: {
    paddingHorizontal: 20,
  },
  marginHorizontal15: {
    marginHorizontal: 15,
  },
  marginHorizontal10: {
    marginHorizontal: 10,
  },
  width300: {
    width: 300,
  },
  width320: {
    width: 320,
  },
  inputBox: {
    borderRadius: 15,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    height: 40,
    padding: 8,
    marginVertical: 10,
    margin: 10,
  },
  noBorderInput: {
    borderWidth: 0,
    borderBottomWidth: 1.0,
    width: 300,
    backgroundColor: '#f7f2f1',
    textAlign: 'center',
    marginVertical: 20,
  },
  namesInput: {
    borderRadius: 15,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    width: 140,
    height: 40,
    textAlign: 'left',
    marginTop: 10,
    margin: 10,
    paddingHorizontal: 10,
  },
  eventInputBox: {
    borderRadius: 10,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    height: 40,
    marginVertical: 10,
    margin: 5,
  },
  multiline: {
    borderRadius: 15,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    height: 100,
    textAlign: 'left',
    marginTop: 10,
    margin: 10,
    paddingHorizontal: 10,
  },
  Buttons: {
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: {height: 3, width: 3}, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 4, // Android
    borderWidth: 1,
    backgroundColor: '#3c4498',
    justifyContent: 'center',
    borderColor: '#3c4498',
    borderRadius: 25,
    width: 300,
    height: 40,
    marginVertical: 10,
  },
  disabledButtons: {
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: {height: 3, width: 3}, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 4, // Android
    borderWidth: 1,
    backgroundColor: '#ded9d8',
    justifyContent: 'center',
    borderColor: '#ded9d8',
    borderRadius: 25,
    width: 300,
    height: 40,
    marginVertical: 10,
  },
  logoutButtons: {
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: {height: 2, width: 2}, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 4, // Android
    backgroundColor: 'silver',
    justifyContent: 'center',
    borderRadius: 25,
    width: 100,
    height: 30,
    marginVertical: 10,
    margin: 10,
  },
  sortButton: {
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: {height: 2, width: 2}, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 4, // Android
    backgroundColor: 'black',
    justifyContent: 'center',
    borderRadius: 25,
    width: 130,
  },
  sortText: {
    fontWeight: '400',
    color: 'white',
    textAlign: 'center',
  },
  userTypeButtons: {
    width: 160,
    height: 80,
  },
  customBtnText: {
    fontSize: 20,
    fontWeight: '400',
    color: 'white',
    textAlign: 'center',
  },
  disabledBtnText: {
    fontSize: 20,
    fontWeight: '400',
    color: 'black',
    textAlign: 'center',
  },
  generalText: {
    padding: 15,
    color: 'black',
    alignSelf: 'center',
    fontSize: 20,
    textAlign: 'center',
  },
  iAmUserTypeText: {
    fontSize: 35,
    fontWeight: '400',
    color: 'black',
    textAlign: 'center',
    marginVertical: 30,
  },
  infoHereText: {
    fontSize: 16,
    fontWeight: '400',
    color: 'red',
    textAlign: 'center',
  },
  securityCodeAsterisk: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    marginHorizontal: 30,
    marginTop: 10,
    marginBottom: 20,
  },
  securityCodeText: {
    fontSize: 28,
    fontWeight: '400',
    color: 'black',
    textAlign: 'center',
    marginBottom: 15,
  },
  colorBlack: {
    color: 'black',
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  rowCenter: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  rowSpaceAround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  marginBottom30: {
    marginBottom: 30,
  },
  marginBottom15: {
    marginBottom: 15,
  },
  defualtCardStyles: {
    padding: 15,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDesc: {
    marginTop: 3,
  },
  cardDateAndBy: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    opacity: 0.5,
  },
  iconBadge: {
    marginTop: 9,
    opacity: 0.5,
    marginLeft: -10,
  },
  pastorTag: {
    paddingHorizontal: 8,
    height: 20,
    backgroundColor: '#f06464',
    borderRadius: 15,
    justifyContent: 'center',
  },
  italic: {
    fontStyle: 'italic',
  },
  italicCenter: {
    fontStyle: 'italic',
    textAlign: 'center',
  },
  fontSize28: {
    fontSize: 28,
  },
  fontSize20: {
    fontSize: 20,
  },
  fontSize18: {
    fontSize: 18,
  },
  fontSize16: {
    fontSize: 16,
  },
  actionButtons: {
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: {height: 3, width: 3}, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 3, // Android
    backgroundColor: '#B2ACAC',
    borderColor: '#B2ACAC',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    width: 90,
    paddingVertical: 5,
  },
  widthMonth: {
    width: 33,
  },
  widthDay: {
    width: 33,
  },
  widthYear: {
    width: 45,
  },
  widthHour: {
    width: 40,
  },
  widthMinute: {
    width: 58,
  },
  widthAMorPM: {
    width: 58,
  },
  width120: {
    width: 120,
  },
  width140: {
    width: 140,
  },
  profileTopView: {
    flex: 2,
    flexDirection: 'row',
    borderBottomColor: 'black',
    borderBottomWidth: 3,
    paddingBottom: 10,
    marginBottom: 20,
  },
  profileTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 20,
    // marginTop: 20,
    textAlign: 'center',
  },
  profileCounters: {
    fontSize: 18,
    textAlign: 'center',
  },
  profileInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchBarContainer: {
    backgroundColor: '#f7f2f1',
    borderTopColor: '#f7f2f1',
    borderBottomColor: '#f7f2f1',
    marginHorizontal: 15,
  },
  searchBarInput: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingLeft: 5,
  },
  searchBarInputContainer: {
    backgroundColor: '#ded9d8',
  },
  logoutText: {
    color: 'black',
    textAlign: 'center',
    marginHorizontal: 7,
  },
  spinnerTextStyle: {
    color: '#FFF',
    fontSize: 25,
  },
});
