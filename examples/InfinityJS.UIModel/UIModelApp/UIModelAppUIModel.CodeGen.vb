﻿Option Strict On
Option Explicit On
Option Infer On

'------------------------------------------------------------------------------
' <auto-generated>
'     This code was generated by BBUIModelLibrary
'     Version:  3.0.516.0
'
'     Changes to this file may cause incorrect behavior and will be lost if
'     the code is regenerated.
' </auto-generated>
'------------------------------------------------------------------------------
''' <summary>
''' Represents the UI model for the 'UI Model App' data form
''' </summary>
Partial Public Class UIModelApp
	Inherits Global.Blackbaud.AppFx.UIModeling.Core.CustomUIModel

#Region "Extensibility methods"

    Partial Private Sub OnCreated()
    End Sub

#End Region

    Private WithEvents _html As Global.Blackbaud.AppFx.UIModeling.Core.XMLField
    Private WithEvents _css As Global.Blackbaud.AppFx.UIModeling.Core.XMLField
    Private WithEvents _js As Global.Blackbaud.AppFx.UIModeling.Core.XMLField

	<System.CodeDom.Compiler.GeneratedCodeAttribute("BBUIModelLibrary", "3.0.516.0")> _
    Public Sub New()
        MyBase.New()

        _html = New Global.Blackbaud.AppFx.UIModeling.Core.XMLField
        _css = New Global.Blackbaud.AppFx.UIModeling.Core.XMLField
        _js = New Global.Blackbaud.AppFx.UIModeling.Core.XMLField

        MyBase.FORMHEADER.Value = "UI Model App"
        MyBase.UserInterfaceUrl = "browser/htmlforms/custom/infinityjs/uimodelapp/UIModelApp.html"

        '
        '_html
        '
        _html.Name = "HTML"
        _html.Caption = "HTML"
        Me.Fields.Add(_html)
        '
        '_css
        '
        _css.Name = "CSS"
        _css.Caption = "CSS"
        Me.Fields.Add(_css)
        '
        '_js
        '
        _js.Name = "JS"
        _js.Caption = "JS"
        Me.Fields.Add(_js)

		OnCreated()

    End Sub
    
    <System.CodeDom.Compiler.GeneratedCodeAttribute("BBUIModelLibrary", "3.0.516.0")> _
    Public ReadOnly Property [HTML]() As Global.Blackbaud.AppFx.UIModeling.Core.XMLField
        Get
            Return _html
        End Get
    End Property
    
    <System.CodeDom.Compiler.GeneratedCodeAttribute("BBUIModelLibrary", "3.0.516.0")> _
    Public ReadOnly Property [CSS]() As Global.Blackbaud.AppFx.UIModeling.Core.XMLField
        Get
            Return _css
        End Get
    End Property
    
    <System.CodeDom.Compiler.GeneratedCodeAttribute("BBUIModelLibrary", "3.0.516.0")> _
    Public ReadOnly Property [JS]() As Global.Blackbaud.AppFx.UIModeling.Core.XMLField
        Get
            Return _js
        End Get
    End Property
    
End Class
