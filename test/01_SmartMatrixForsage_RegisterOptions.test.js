const SmartMatrixForsage = artifacts.require('SmartMatrixForsage.sol');
const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
//const web3 = require("web3");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('SmartMatrixForsage', ([owner, alice, bob, max, jhon,...accounts]) => {
    let smartMatrixForsage;

    before(async () => {
        smartMatrixForsage = await SmartMatrixForsage.deployed();

    })
    
    describe('Deployment', async () => {
        it('Deploys successfully', async () => {
            const address = smartMatrixForsage.address;
            assert.notEqual(address, '');
            assert.notEqual(address, 0x0);
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        })
    })

    describe('Added Owner', async () => {
        it('Owner added successfully', async () => {
            const userExists = await smartMatrixForsage.isUserExists(owner)
            assert.equal(userExists, true);
            console.log(`owner: ${owner}`)

            const isUserActiveX3Level = await smartMatrixForsage.usersActiveX3Levels(owner, 1)
            assert.equal(isUserActiveX3Level, true)

            const isUserActiveX6Level = await smartMatrixForsage.usersActiveX6Levels(owner, 1)
            assert.equal(isUserActiveX6Level, true)

        })
    })

    describe('Register New User referred by owner', async () => {
        it('With invalid price. Expect to throw', async () => {
            await expectRevert(
                smartMatrixForsage.registrationExt(owner, { from: alice }),
                'registration cost 0.05'
            );
        });
        
        it('With invalid referrer. Expect to throw', async () => {
            await expectRevert(
                smartMatrixForsage.registrationExt(bob, { from: alice, value: 50000000000000000 }),
                'referrer not exists'
            );
        });

        it('New user registered successfully', async () => {
            
            //console.log(await web3.eth.getBalance(alice))
            await smartMatrixForsage.registrationExt(owner, { from: alice, value: 50000000000000000 })
            //console.log(await web3.eth.getBalance(alice))

            const userExists = await smartMatrixForsage.isUserExists(alice)
            assert.equal(userExists, true);
            //console.log(`alice: ${alice}`)

            const isUserActiveX3Level = await smartMatrixForsage.usersActiveX3Levels(alice, 1)
            assert.equal(isUserActiveX3Level, true)

            const isUserActiveX6Level = await smartMatrixForsage.usersActiveX6Levels(alice, 1)
            assert.equal(isUserActiveX6Level, true)


            const addressReferred3x = await smartMatrixForsage.findFreeX3Referrer(alice, 1)
            assert.equal(addressReferred3x, owner);

            const addressReferred6x = await smartMatrixForsage.findFreeX6Referrer(alice, 1)
            assert.equal(addressReferred6x, owner);

        })

        it('With user registered. Expect to throw', async () => {
            await expectRevert(
                smartMatrixForsage.registrationExt(owner, { from: alice, value: 50000000000000000  }),
                'user exists'
            );
        });

    })

    describe('Register New User referred by user', async () => {
        it('New user registered successfully', async () => {
            
            await smartMatrixForsage.registrationExt(alice, { from: bob, value: 50000000000000000 })

            const userExists = await smartMatrixForsage.isUserExists(bob)
            assert.equal(userExists, true);
            //console.log(`bob: ${bob}`)

            const isUserActiveX3Level = await smartMatrixForsage.usersActiveX3Levels(bob, 1)
            assert.equal(isUserActiveX3Level, true)

            const isUserActiveX6Level = await smartMatrixForsage.usersActiveX6Levels(bob, 1)
            assert.equal(isUserActiveX6Level, true)

            const addressReferred3x = await smartMatrixForsage.findFreeX3Referrer(bob, 1)
            assert.equal(addressReferred3x, alice);

            const addressReferred6x = await smartMatrixForsage.findFreeX6Referrer(bob, 1)
            assert.equal(addressReferred6x, alice);

        })
    })

    describe('Register New User by fallback function', async () => {
        it('New user registered successfully', async () => {

            const address = smartMatrixForsage.address;
            const amount = '0.05';
            await smartMatrixForsage.sendTransaction({ from: max, gasLimit: 6721975, to: address, value: web3.utils.toWei(amount, "ether") })
            const userExists = await smartMatrixForsage.isUserExists(max)
            assert.equal(userExists, true);
            //console.log(`max: ${max}`)

            const isUserActiveX3Level = await smartMatrixForsage.usersActiveX3Levels(max, 1)
            assert.equal(isUserActiveX3Level, true)

            const isUserActiveX6Level = await smartMatrixForsage.usersActiveX6Levels(max, 1)
            assert.equal(isUserActiveX6Level, true)

            const addressReferred3x = await smartMatrixForsage.findFreeX3Referrer(max, 1)
            assert.equal(addressReferred3x, owner);

            const addressReferred6x = await smartMatrixForsage.findFreeX6Referrer(max, 1)
            assert.equal(addressReferred6x, owner);

        })
    })

    describe('Register New User referred by user by fallback function', async () => {
        it('New user registered successfully', async () => {

            const address = smartMatrixForsage.address;
            const amount = '0.05';
            await smartMatrixForsage.sendTransaction({ from: jhon, data: alice, gasLimit: 6721975, to: address, value: web3.utils.toWei(amount, "ether") })

            const userExists = await smartMatrixForsage.isUserExists(jhon)
            assert.equal(userExists, true);
            //console.log(`jhon: ${jhon}`)

            const isUserActiveX3Level= await smartMatrixForsage.usersActiveX3Levels(jhon, 1)
            assert.equal(isUserActiveX3Level, true)

            const isUserActiveX6Level= await smartMatrixForsage.usersActiveX6Levels(jhon, 1)
            assert.equal(isUserActiveX6Level, true)

            const addressReferred3x = await smartMatrixForsage.findFreeX3Referrer(jhon, 1)
            assert.equal(addressReferred3x, alice);

            const addressReferred6x = await smartMatrixForsage.findFreeX6Referrer(jhon, 1)
            assert.equal(addressReferred6x, alice);

        })
    })

});
