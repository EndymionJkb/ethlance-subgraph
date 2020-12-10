const EthlanceJobs = artifacts.require('./EthlanceJobs.sol')

module.exports = async function(deployer) {
  await deployer.deploy(EthlanceJobs)
}
