// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'

import VaccinationByGender from '../VaccinationByGender'

import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const caponentsValues = {
  pending: 'PENDING',
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
}

class CowinDashboard extends Component {
  state = {
    fetchedData: {},
    displayStatus: caponentsValues.initial,
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({displayStatus: caponentsValues.pending})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    const data = await response.json()
    if (response.ok === true) {
      const convertData = {
        last7DaysVaccination: data.last_7_days_vaccination,
        vaccinationByGender: data.vaccination_by_gender,
        vaccinationByAge: data.vaccination_by_age,
      }
      this.setState({
        fetchedData: convertData,
        displayStatus: caponentsValues.success,
      })
    } else {
      this.setState({displayStatus: caponentsValues.failure})
    }
  }

  renderPycharts = () => {
    const {fetchedData} = this.state
    const {
      last7DaysVaccination,
      vaccinationByGender,
      vaccinationByAge,
    } = fetchedData

    return (
      <>
        <VaccinationCoverage vaccinationData={last7DaysVaccination} />
        <VaccinationByGender vaccinationByGender={vaccinationByGender} />
        <VaccinationByAge vaccinationByAge={vaccinationByAge} />
      </>
    )
  }

  loadingView = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  failureView = () => (
    <div className="failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1>Something went wrong</h1>
    </div>
  )

  switchCaseCheck = () => {
    const {displayStatus} = this.state
    switch (displayStatus) {
      case caponentsValues.success:
        return this.renderPycharts()
      case caponentsValues.failure:
        return this.failureView()
      case caponentsValues.pending:
        return this.loadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg">
        <div className="header">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="logo"
          />
          <p className="heading">Co-WIN</p>
        </div>
        <h1 className="title">CoWIN Vaccination in India</h1>
        <div>{this.switchCaseCheck()}</div>
      </div>
    )
  }
}

export default CowinDashboard
