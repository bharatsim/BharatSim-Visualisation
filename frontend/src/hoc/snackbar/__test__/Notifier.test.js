import React from "react"
import { render  } from '@testing-library/react'

import Notifier from "../Notifier";
import {useSelector, useDispatch} from "react-redux";
import {useSnackbar} from "notistack";
import { removeSnackbar } from '../snackBarActions';

jest.mock('react-redux',()=>{
    const dispatch = jest.fn();
    return {
        useSelector : jest.fn((fn)=> fn({snackBar:{notifications:[]}})),
        useDispatch: ()=> dispatch
    }
})

jest.mock('notistack',()=>{
    const  snackbarContext ={enqueueSnackbar: jest.fn(), closeSnackbar: jest.fn()}
    return {
        useSnackbar:() =>snackbarContext
    }
})

describe('notifier',()=>{
    let notification = {message: "success", key: "1"};
    afterEach(()=>{
        useSnackbar().enqueueSnackbar.mock.calls[0][1].onExited({}, notification.key)
        jest.clearAllMocks()

    })

    it("should enqueue all the messages from store",()=>{
       const  enqueueSnackbar  =  useSnackbar().enqueueSnackbar
        useSelector.mockReturnValue([notification])

        render(<Notifier />)
        expect(enqueueSnackbar).toHaveBeenCalledWith("success", expect.anything())
    })

    it("should not show duplicate message ",()=>{
        const  enqueueSnackbar  =  useSnackbar().enqueueSnackbar
        useSelector.mockReturnValue([notification, notification])

        render(<Notifier />)
        expect(enqueueSnackbar).toBeCalledTimes(1)
    })

    it("should remove message on exit",()=>{
        const dispatch = useDispatch()
        const  enqueueSnackbar  =  useSnackbar().enqueueSnackbar
        useSelector.mockReturnValue([notification])

        let onExited;
        enqueueSnackbar.mockImplementation((msg, options)=>{
            onExited =  options.onExited;
        })
        render(<Notifier/>)
        onExited({}, notification.key)

        expect(dispatch).toHaveBeenCalledWith(removeSnackbar(notification.key))
    })
    it("should call onClose on message close ",()=>{
        const  enqueueSnackbar  =  useSnackbar().enqueueSnackbar

        const onCloseMock = jest.fn()
        let notification = {message: "success", key: "1", options: {onClose: onCloseMock}};
        useSelector.mockReturnValue([notification])
        let onCloseHandler;

        enqueueSnackbar.mockImplementation((msg, options)=>{
            onCloseHandler =  options.onClose;
        })
        render(<Notifier/>)

        onCloseHandler({}, {},notification.key)
        expect(onCloseMock).toHaveBeenCalled()
    })


})