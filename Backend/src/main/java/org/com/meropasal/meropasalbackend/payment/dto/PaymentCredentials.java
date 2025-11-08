package org.com.meropasal.meropasalbackend.payment.dto;


/**
 * Created On : 2025 26 Sep 8:40 PM
 * Author : Monu Siddiki
 * Description :
 **/
public sealed interface PaymentCredentials
        permits EsewaCredentials, KhaltiCredentials, BankTransferCredentials, CodCredentials {
}
