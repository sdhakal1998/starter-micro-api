var http = require('http');
http.createServer(function (req, res) {
    console.log(`Just got a request at ${req.url}!`)
    res.write("\n\
% Phase-I Input the parameter\n\
Variables={'x1', 'x2', 's2', 's3', 'A1', 'A2', 'sol'};\n\
M=1000;\n\
Cost=[-2 -1 0 0 -M -M 0]; % Cost of LPP\n\
A=[3 1 0 0 1 0 3; 4 3 -1 0 0 1 6; 1 2 0 1 0 0 3]; % constraints\n\
s=eye(size(A,1));\n\
% To find the starting BFS\n\
BV=[]\n\
for j=1:size(s,2)\n\
    for i=1:size(A,2)\n\
        if A(:,i)==s(:,j)\n\
            BV=[BV i]\n\
\n\
        end\n\
    end\n\
end\n\
% Simplex method starts\n\
ZjCj=Cost(BV)*A-Cost;\n\
% For printing the table\n\
ZCj=[ZjCj; A];\n\
Simplextable=array2table(ZCj);\n\
Simplextable.Properties.VariableNames(1:size(ZCj,2))=Variables\n\
% Simplex method starts\n\
Run=true;\n\
while Run\n\
if any(ZjCj<0) % to check if any neagative value is there\n\
   fprintf('The current BFS is not optimal \n')\n\
   fprintf('The next iteration is required \n')\n\
    disp('Old Basic variable (BV)= \n')\n\
    disp(BV)\n\
    % for finding the entering variable\n\
    ZC=ZjCj(1:end-1);\n\
    [EnterCol, pvt_Col]=min(ZC);\n\
    fprintf('The most negative element in Zj-Cj row is %d corresponding to column %d \n', EnterCol, pvt_Col)\n\
    fprintf('Entering variable is %d \n', pvt_Col)\n\
    % For find the leaving variable\n\
    sol=A(:,end);\n\
    Column=A(:,pvt_Col);\n\
    if all(Column<=0)\n\
        error('The LPP has unbounded solution. Since all the entries <=0 in column %d \n', pvt_Col)\n\
    else\n\
        % To check minimum ratio for positive pivot column entries\n\
        for i=1:size(Column,1)\n\
            if Column(i)>0\n\
                ratio(i)=sol(i)./Column(i)\n\
            else\n\
                ratio(i)=inf\n\
            end\n\
        end\n\
    end\n\
else\n\
    disp('Optimal soltion is reached')\n\
end\n\
% To finding the minimum ratio\n\
[minratio, pvt_Row]=min(ratio)\n\
fprintf('Minimum ratio corresponding to pivot row %d \n', pvt_Row)\n\
fprintf('Leaving variable is %d \n', BV(pvt_Row))\n\
BV(pvt_Row)=pvt_Col;\n\
disp('New basic variables (BV)==')\n\
disp(BV)\n\
\n\
pvt_Key=A(pvt_Row, pvt_Col);\n\
\n\
A(pvt_Row,:)=A(pvt_Row,:)./pvt_Key;\n\
for i=1:size(A,1)\n\
    if i~=pvt_Row\n\
        A(i,:)=A(i,:)-A(i,pvt_Col).*A(pvt_Row,:)\n\
    end\n\
    ZjCj=ZjCj-ZjCj(pvt_Col).*A(pvt_Row,:)\n\
end\n\
% For printing \n\
ZCj=[ZjCj; A];\n\
Table=array2table(ZCj);\n\
Table.Properties.VariableNames(1:size(ZCj,2))=Variables\n\
BFS=zeros(1,size(A,2));\n\
BFS(BV)=A(:,end);\n\
BFS(end)=-sum(BFS.*Cost); %The task is to minimize. We had changed the problem so. \n\
Current_BFS=array2table(BFS);\n\
Current_BFS.Properties.VariableNames(1:size(Current_BFS,2))=Variables\n\
if any(ZjCj(1:end-1)<0)\n\
    Run=true\n\
else\n\
    Run=false\n\
    fprintf('The current BFS is optimal \n')\n\
    BFS=BV;\n\
end\n\
end\n\
 \n\
              ");
    res.end();
}).listen(process.env.PORT || 3000);
