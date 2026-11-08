function expenseSummary(expenses){
 const balances={},add=(id,n)=>balances[id]=(balances[id]||0)+n;let total=0;
 for(const item of expenses){total+=item.amountSatang;add(item.payer,item.amountSatang);const base=Math.floor(item.amountSatang/item.participants.length),remainder=item.amountSatang%item.participants.length;item.participants.forEach((id,i)=>add(id,-base-(i<remainder?1:0)));}
 const debtors=Object.entries(balances).filter(([,n])=>n<0).map(([id,n])=>({id,amount:-n})),creditors=Object.entries(balances).filter(([,n])=>n>0).map(([id,n])=>({id,amount:n})),transfers=[];
 let i=0,j=0;while(i<debtors.length&&j<creditors.length){const amount=Math.min(debtors[i].amount,creditors[j].amount);transfers.push({from:debtors[i].id,to:creditors[j].id,amountSatang:amount});debtors[i].amount-=amount;creditors[j].amount-=amount;if(!debtors[i].amount)i++;if(!creditors[j].amount)j++;}
 return {totalSatang:total,balances,transfers};
}
if(typeof module!=='undefined')module.exports={expenseSummary};
