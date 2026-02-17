import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  logo: {
    height: '30%',
    width: '50%',
    borderRadius: 15,
    // backgroundColor:'red'
  },
  logoImg: {
    height: '100%',
    width: '100%',
    borderRadius: 8
  },
  relatedLink: {
    color: 'green'
  },
  relatedLinkText: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold'
  },
  formLebel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'green'
  },
  headerLeftText: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 18
  },
  headerRightText: {
    flexDirection: 'row',
    marginRight: 10,
    alignItems: 'center'
  }
});