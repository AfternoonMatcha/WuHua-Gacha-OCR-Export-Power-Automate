Display.ShowMessageDialog.ShowMessage Title: $fx'物华抽卡记录导出自动化 OCR' Message: $fx'Matce. 240520-01
① 运行前请先确保游戏窗口招集记录页面在单个屏幕内【完全可见】
② 运行中请【不要移动、缩放、开关】游戏窗口直至获取完毕
③ 请务必从招集记录的【第一页】开始，否则程序会重复读取多次最后一页
④ 为了执行翻页，请尽可能地【不要使用鼠标】直至运行完毕' Icon: Display.Icon.Information Buttons: Display.Buttons.OK DefaultButton: Display.DefaultButton.Button1 IsTopMost: True
UIAutomation.FocusWindow.FocusByTitleClass Title: $fx'MuMu模拟器12' Class: $fx'=""'
ON ERROR
    SET 是否自动聚焦到窗口 TO $fx'No'
END
IF $fx'=是否自动聚焦到窗口 = "No"' THEN
    Display.ShowMessageDialog.ShowMessageWithTimeout Title: $fx'即将于 5 秒后开始获取记录' Message: $fx'请手动切换至游戏窗口并保持其在最上层活动状态
本窗口将自动关闭，【无需点击】下方确定' Icon: Display.Icon.Information Buttons: Display.Buttons.OK DefaultButton: Display.DefaultButton.Button2 IsTopMost: True Timeout: $fx'=5'
END
WAIT (OCR.WaitForTextOnScreen.TextOnScreenToAppearWithWindowsOcr TextToFind: $fx'可查询' IsRegex: False WindowsOcrLanguage: OCR.WindowsOcrLanguage.ChineseSimplified SearchForTextOn: OCR.SearchTarget.ForegroundWindow ImageWidthMultiplier: $fx'=1' ImageHeightMultiplier: $fx'=1' TextLocationX=> 左 TextLocationY=> 上)
WAIT (OCR.WaitForTextOnScreen.TextOnScreenToAppearWithWindowsOcr TextToFind: $fx'可查询' IsRegex: False WindowsOcrLanguage: OCR.WindowsOcrLanguage.ChineseSimplified SearchForTextOn: OCR.SearchTarget.ForegroundWindow ImageWidthMultiplier: $fx'=1' ImageHeightMultiplier: $fx'=1' TextLocationX=> 左 TextLocationY=> 上)
WAIT (OCR.WaitForTextOnScreen.TextOnScreenToAppearWithWindowsOcr TextToFind: $fx'时间' IsRegex: False WindowsOcrLanguage: OCR.WindowsOcrLanguage.ChineseSimplified SearchForTextOn: OCR.SearchTarget.ForegroundWindow ImageWidthMultiplier: $fx'=1' ImageHeightMultiplier: $fx'=1' TextLocationX=> 右)
WAIT (OCR.WaitForTextOnScreen.TextOnScreenToAppearWithWindowsOcr TextToFind: $fx'下一页' IsRegex: False WindowsOcrLanguage: OCR.WindowsOcrLanguage.ChineseSimplified SearchForTextOn: OCR.SearchTarget.ForegroundWindow ImageWidthMultiplier: $fx'=1' ImageHeightMultiplier: $fx'=1' TextLocationX=> 下一页X TextLocationY=> 下一页Y)
SET 下 TO $fx'=下一页Y'
SET 基准高度 TO $fx'549'
SET 基准宽度 TO $fx'1018'
SET 上 TO $fx'=Int(上 + ((下 - 上) * (92 / 基准高度)))'
SET 下 TO $fx'=Int(下 - ((下 - 上) * (43 / 基准高度)))'
SET 右 TO $fx'=Int(右 + ((右 - 左) * (218 / 基准宽度)))'
SET 单元格X1 TO $fx'=Int(左 + ((右 - 左) * (160 / 基准宽度)))'
SET 单元格X2 TO $fx'=Int(左 + ((右 - 左) * (510 / 基准宽度)))'
SET 单元格X3 TO $fx'=Int(左 + ((右 - 左) * (691.5 / 基准宽度)))'
SET 页码X TO $fx'=Int(下一页X - ((右 - 左) * (55 / 基准宽度)))'
SET 页码Y TO $fx'=下一页Y'
SET 页码半边长 TO $fx'=Int((右 - 左) * (24 / 基准宽度))'
OCR.ExtractTextWithOCR.ExtractTextFromRegionOfForegroundWindowWithWindowsOcr WindowsOcrLanguage: OCR.WindowsOcrLanguage.ChineseSimplified ImageWidthMultiplier: $fx'=1' ImageHeightMultiplier: $fx'=1' X1: $fx'=页码X - 页码半边长' X2: $fx'=页码X + 页码半边长' Y1: $fx'=页码Y - 页码半边长' Y2: $fx'=页码Y + 页码半边长' OcrText=> 总页数
IF $fx'=总页数 = "
"' THEN
    Display.InputDialog Title: $fx'未能自动获取得到总页数' Message: $fx'请手动输入当前招集记录总页数。输入错误或点击取消将会导致程序只读取当前一页或发生错误' DefaultValue: $fx'1' InputType: Display.InputType.SingleLine IsTopMost: True UserInput=> 总页数
    UIAutomation.FocusWindow.FocusByTitleClass Title: $fx'MuMu模拟器12' Class: $fx'=""'
    ON ERROR
        SET 是否自动聚焦到窗口 TO $fx'No'
    END
END
SET 总记录 TO $fx'='
SET 行高 TO $fx'=(下 - 上) / 10'
LOOP 任务页码 FROM $fx'=1' TO $fx'=Value(总页数)' STEP $fx'=1'
    LOOP 任务行 FROM $fx'=1' TO $fx'=10' STEP $fx'=1'
        OCR.ExtractTextWithOCR.ExtractTextFromRegionOfForegroundWindowWithWindowsOcr WindowsOcrLanguage: OCR.WindowsOcrLanguage.ChineseSimplified ImageWidthMultiplier: $fx'=1' ImageHeightMultiplier: $fx'=1' X1: $fx'=左' X2: $fx'=单元格X1' Y1: $fx'=Int(上 + ((任务行 - 1) * 行高))' Y2: $fx'=Int(上 + (任务行 * 行高))' OcrText=> 稀有度
        OCR.ExtractTextWithOCR.ExtractTextFromRegionOfForegroundWindowWithWindowsOcr WindowsOcrLanguage: OCR.WindowsOcrLanguage.ChineseSimplified ImageWidthMultiplier: $fx'=1' ImageHeightMultiplier: $fx'=1' X1: $fx'=单元格X1' X2: $fx'=单元格X2' Y1: $fx'=Int(上 + ((任务行 - 1) * 行高))' Y2: $fx'=Int(上 + (任务行 * 行高))' OcrText=> 器者
        OCR.ExtractTextWithOCR.ExtractTextFromRegionOfForegroundWindowWithWindowsOcr WindowsOcrLanguage: OCR.WindowsOcrLanguage.ChineseSimplified ImageWidthMultiplier: $fx'=1' ImageHeightMultiplier: $fx'=1' X1: $fx'=单元格X2' X2: $fx'=单元格X3' Y1: $fx'=Int(上 + ((任务行 - 1) * 行高))' Y2: $fx'=Int(上 + (任务行 * 行高))' OcrText=> 招集
        OCR.ExtractTextWithOCR.ExtractTextFromRegionOfForegroundWindowWithWindowsOcr WindowsOcrLanguage: OCR.WindowsOcrLanguage.ChineseSimplified ImageWidthMultiplier: $fx'=1' ImageHeightMultiplier: $fx'=1' X1: $fx'=单元格X3' X2: $fx'=右' Y1: $fx'=Int(上 + ((任务行 - 1) * 行高))' Y2: $fx'=Int(上 + (任务行 * 行高))' OcrText=> 时间
        IF $fx'=!(Len(稀有度) <= 3 && Len(器者) <= 3 && Len(招集) <= 3 && Len(时间) <= 3) && (Len(稀有度) <= 3 || Len(器者) <= 3 || Len(招集) <= 3 || Len(时间) <= 3)' THEN
            Variables.IncreaseVariable Value: $fx'=识别单元格为空计数' IncrementValue: $fx'1'
        END
        Text.AppendLine Text: $fx'=总记录' LineToAppend: $fx'=Concatenate(Substitute(稀有度, " ",""), Substitute(器者, " ",""), Substitute(招集, " ",""), Substitute(时间, " ",""))' Result=> 总记录
    END
    IF $fx'=Value(总页数) >= 任务页码' THEN
        MouseAndKeyboard.SendMouseClick.ClickAt ClickType: MouseAndKeyboard.MouseClickType.LeftClick MillisecondsDelay: $fx'=0' X: $fx'=下一页X' Y: $fx'=下一页Y' RelativeTo: MouseAndKeyboard.PositionRelativeTo.ActiveWindow MovementStyle: MouseAndKeyboard.MovementStyle.Instant
    END
END
Display.ShowMessageDialog.ShowMessage Title: $fx'导出完成' Message: $fx'是否转换为更紧凑的 Base64 编码格式方便复制和粘贴？选否将以明文文本格式输出' Icon: Display.Icon.Question Buttons: Display.Buttons.YesNo DefaultButton: Display.DefaultButton.Button1 IsTopMost: True ButtonPressed=> 是否转为Base64
File.GetTempPath TempFile=> 临时文件
File.WriteText File: $fx'=临时文件' TextToWrite: $fx'=总记录' AppendNewLine: True IfFileExists: File.IfFileExists.Overwrite Encoding: File.FileEncoding.UTF8
IF $fx'=是否转为Base64 = "Yes"' THEN
    File.ConvertToBase64 File: $fx'=临时文件' Base64Text=> 总记录
    File.Delete Files: $fx'=临时文件'
END
Clipboard.SetText Text: $fx'=总记录'
Display.InputDialog Title: $fx'导出完成' Message: $fx'已尝试自动复制下述导出的记录至您的剪贴板，请检查是否有效或是手动进行全选复制，关闭窗口将会丢失记录。共尝试获取了 ${任务页码 - 1} 页的记录，识别到存在空单元格的记录为 ${识别单元格为空计数} 条（完全为空的记录不计入），如果有出现这种情况，稍后可前往导入工具根据提示进行补全数据' DefaultValue: $fx'=总记录' InputType: Display.InputType.Multiline IsTopMost: True